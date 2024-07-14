import { App, Notice, requestUrl, TFile } from "obsidian";
import { markdownToBlocks } from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import { DatabaseDetails, PluginSettings } from "../../ui/settingTabs";
import { updateYamlInfo } from "../updateYaml";
import { UploadBaseCustom } from "./BaseUpload2NotionCustom";

export class Upload2NotionCustom extends UploadBaseCustom {
	settings: PluginSettings;
	dbDetails: DatabaseDetails;

	constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
		super(plugin, dbDetails);
		this.dbDetails = dbDetails;
	}

	// 因为需要解析notion的block进行对比，非常的麻烦，
	// 暂时就直接删除，新建一个page
	async updatePage(
		notionID: string,
		cover: string,
		customValues: Record<string, string>,
		childArr: any,
	) {
		await this.deletePage(notionID);

		const { databaseID } = this.dbDetails;

		const databaseCover = await this.getDataBase(
			databaseID
		);

		if (cover == null) {
			cover = databaseCover;
		}

		return await this.createPage(cover, customValues, childArr);
	}

	async createPage(
		cover: string,
		customValues: Record<string, string>,
		childArr: any,
	) {

		const {
			databaseID,
			customProperties,
			notionAPI
		} = this.dbDetails;

		const bodyString: any = this.buildBodyString(customProperties, customValues, childArr);

		if (cover) {
			bodyString.cover = {
				type: "external",
				external: {
					url: cover,
				},
			};
		}

		if (!bodyString.cover && this.plugin.settings.bannerUrl) {
			bodyString.cover = {
				type: "external",
				external: {
					url: this.plugin.settings.bannerUrl,
				},
			};
		}

		console.log(bodyString)

		try {
			return await requestUrl({
				url: `https://api.notion.com/v1/pages`,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// 'User-Agent': 'obsidian.md',
					Authorization:
						"Bearer " + notionAPI,
					"Notion-Version": "2022-06-28",
				},
				body: JSON.stringify(bodyString),
			});
		} catch (error) {
			new Notice(`network error ${error}`);
		}
	}

	async syncMarkdownToNotionCustom(
		cover: string,
		customValues: Record<string, string>,
		markdown: string,
		nowFile: TFile,
		app: App,
	): Promise<any> {
		const options = {
			strictImageUrls: true,
			notionLimits: {
				truncate: false,
			}
		}
		let res: any;
		const yamlContent: any = yamlFrontMatter.loadFront(markdown);
		const __content = yamlContent.__content;
		const file2Block = markdownToBlocks(__content, options);
		const frontmasster =
			app.metadataCache.getFileCache(nowFile)?.frontmatter;
		const { abName } = this.dbDetails
		const notionIDKey = `NotionID-${abName}`;
		const notionID = frontmasster ? frontmasster[notionIDKey] : null;

		if (notionID) {
			res = await this.updatePage(
				notionID,
				cover,
				customValues,
				file2Block,
			);
		} else {
			res = await this.createPage(cover, customValues, file2Block);
		}
		if (res && res.status === 200) {
			await updateYamlInfo(markdown, nowFile, res, app, this.plugin, this.dbDetails);
		} else {
			new Notice(`${res.text}`);
		}
		return res;
	}

	private buildPropertyObject(customName: string, customType: string, customValues: Record<string, any>) {
		const value = customValues[customName] || '';

		switch (customType) {
			case "title":
				return {
					title: [
						{
							text: {
								content: value,
							},
						},
					],
				};
			case "rich_text":
				return {
					rich_text: [
						{
							text: {
								content: value || '',
							},
						},
					],
				};
			case "date":
				return {
					date: {
						start: value || new Date().toISOString(),
					},
				};
			case "number":
				return {
					number: Number(value),
				};
			case "phone_number":
				return {
					phone_number: value,
				};
			case "email":
				return {
					email: value,
				};
			case "url":
				return {
					url: value,
				};
			case "files":
				return {
					files: Array.isArray(value) ? value.map(url => ({
						name: url,
						type: "external",
						external: {
							url: url,
						},
					})) : [
						{
							name: value,
							type: "external",
							external: {
								url: value,
							},
						},
					],
				};
			case "checkbox":
				return {
					checkbox: Boolean(value) || false,
				};
			case "select":
				return {
					select: {
						name: value,
					},
				};
			case "multi_select":
				return {
					multi_select: Array.isArray(value) ? value.map(item => ({ name: item })) : [{ name: value }],
				};
		}
	}

	private buildBodyString(
		customProperties: { customName: string; customType: string }[],
		customValues: Record<string, string>,
		childArr: any,
	) {

		const properties: { [key: string]: any } = {};

		// Only include custom properties that have values
		customProperties.forEach(({ customName, customType }) => {
			if (customValues[customName] !== undefined) {
				properties[customName] = this.buildPropertyObject(customName, customType, customValues);
			}
		}
		);

		// console.log(properties)

		return {
			parent: {
				database_id: this.dbDetails.databaseID,
			},
			properties,
			children: childArr,
		};
	}

}
