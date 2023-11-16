import { App, Notice, requestUrl, TFile } from "obsidian";
import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import { PluginSettings } from "../../ui/settingTabs";
import { UploadBaseGeneral } from "./BaseUpload2NotionGeneral";
import { updateYamlInfo } from "../updateYaml";

export class Upload2NotionGeneral extends UploadBaseGeneral {
	settings: PluginSettings;

	constructor(plugin: MyPlugin) {
		super(plugin);
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

		const databasecover = await this.getDataBase(
			this.plugin.settings.databaseIDGeneral,
		);

		if (cover == null) {
			cover = databasecover;
		}

		return await this.createPage(title, cover, tags, childArr);
	}

	async createPage(
		title: string,
		cover: string,
		tags: string[],
		childArr: any,
	) {
		const bodyString: any = {
			parent: {
				database_id: this.plugin.settings.databaseIDGeneral,
			},
			properties: {
				[this.plugin.settings.CustomTitleButton
					? this.plugin.settings.CustomTitleName
					: "title"]: {
					title: [
						{
							text: {
								content: title,
							},
						},
					],
				},
				tags: {
					multi_select:
						tags && true
							? tags.map((tag) => {
								return { name: tag };
							})
							: [],
				},
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

		try {
			return await requestUrl({
				url: `https://api.notion.com/v1/pages`,
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					// 'User-Agent': 'obsidian.md',
					Authorization:
						"Bearer " + this.plugin.settings.notionAPIGeneral,
					"Notion-Version": "2022-06-28",
				},
				body: JSON.stringify(bodyString),
			});
		} catch (error) {
			new Notice(`network error ${error}`);
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
		const notionID = frontmasster ? frontmasster.notionID : null;

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
		if (res.status === 200) {
			await updateYamlInfo(markdown, nowFile, res, app, this.plugin);
		} else {
			new Notice(`${res.text}`);
		}
		return res;
	}
}
