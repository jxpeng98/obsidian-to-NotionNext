import { App, Notice, TFile } from "obsidian";
import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import { DatabaseDetails, PluginSettings } from "../../ui/settingTabs";
import { UploadBaseGeneral } from "./BaseUpload2NotionGeneral";
import { updateYamlInfo } from "../updateYaml";
import fetch from 'node-fetch';

export class Upload2NotionGeneral extends UploadBaseGeneral {
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
		title: string,
		cover: string,
		tags: string[],
		childArr: any,
	) {
		await this.deletePage(notionID);

		const { databaseID } = this.dbDetails;

		const databaseCover = await this.getDataBase(
			databaseID,
		);

		if (cover == null) {
			cover = databaseCover;
		}

		return await this.createPage(title, cover, tags, childArr);
	}

	async createPage(
		title: string,
		cover: string,
		tags: string[],
		childArr: any,
	) {

		const {
			databaseID,
			customTitleButton,
			customTitleName,
			tagButton,
			notionAPI
		} = this.dbDetails;

		const bodyString: any = {
			parent: {
				database_id: databaseID,
			},
			properties: {
				[customTitleButton
					? customTitleName
					: "title"]: {
					title: [
						{
							text: {
								content: title,
							},
						},
					],
				},
				...(tagButton
					? {
						tags: {
							multi_select: tags && true ? tags.map((tag) => ({ name: tag })) : [],
						},
					}
					: {}),
			},
			children: childArr,
		};

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

		const response = await fetch("https://api.notion.com/v1/pages", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + notionAPI,
				"Notion-Version": "2022-06-28",
			},
			body: JSON.stringify(bodyString),
		});

		const data: any = await response.json();
		if (!response.ok) {
			new Notice(`Error ${data.status}: ${data.code} \n Check the console for more information \n opt+cmd+i/ctrl+shift+i`, 5000);
			console.log(`Error message: \n ${data.message}`);
		} else {
			console.log(`Page created: ${data.url}`);
			console.log(`Page ID: ${data.id}`);
		}

		return {
			response, // for status code
			data // for id and url
		}
	}

	async syncMarkdownToNotionGeneral(
		title: string,
		cover: string,
		tags: string[],
		markdown: string,
		nowFile: TFile,
		app: App,
	): Promise<any> {
		const options = {
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
				title,
				cover,
				tags,
				file2Block,
			);
		} else {
			res = await this.createPage(title, cover, tags, file2Block);
		}

		let {response, data} = res;

		// console.log(response)

		if (response && response.status === 200) {
			await updateYamlInfo(markdown, nowFile, data, app, this.plugin, this.dbDetails);
		}

		return res;
	}
}
