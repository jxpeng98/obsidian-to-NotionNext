import {App, Notice, TFile, requestUrl} from "obsidian";
import {markdownToBlocks} from "@jxpeng98/martian";
import * as yamlFrontMatter from "yaml-front-matter";
import MyPlugin from "src/main";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";
import {UploadBaseGeneral} from "./BaseUpload2NotionGeneral";
import {updateYamlInfo} from "../updateYaml";
import {i18nConfig} from "../../lang/I18n";

interface CreatePageResponse {
	response: any;
	data: any;
}

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

		const {databaseID} = this.dbDetails;

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
	): Promise<CreatePageResponse> {

		const {
			databaseID,
			customTitleButton,
			customTitleName,
			tagButton,
			notionAPI
		} = this.dbDetails;

		// remove the annotations from the childArr if type is code block
		childArr.forEach((block: any) => {
				if (block.type === "code") {
					block.code.rich_text.forEach((item: any) => {
							if (item.type === "text" && item.annotations) {
								delete item.annotations;
							}
						}
					);
				}
			}
		);

		// check the length of the childArr and split it into chunks of 100
		const childArrLength = childArr.length;
		let extraArr: any[] = [];
		let firstArr: any;
		let pushCount = 0;

		console.log(`Page includes ${childArrLength} blocks`)

		if (childArrLength > 100) {
			for (let i = 0; i < childArr.length; i += 100) {
				if (i == 0) {
					firstArr = childArr.slice(0, 100);
				} else {
					const chunk = childArr.slice(i, i + 100);
					extraArr.push(chunk);
					pushCount++;
				}
			}
		} else {
			firstArr = childArr;
		}

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
							multi_select: tags && true ? tags.map((tag) => ({name: tag})) : [],
						},
					}
					: {}),
			},
			children: firstArr,
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

		let response: any;
		let data: any;

		response = await requestUrl({
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
			throw: false
		});

		data = await response.json;

		// console.log(data)
		// console.log(response.status)

		if (response.status !== 200) {
			new Notice(`Error ${data.status}: ${data.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
			console.log(`Error message: \n ${data.message}`);
		} else {
			console.log(`Page created: ${data.url}`);
			console.log(`Page ID: ${data.id}`);
		}
		//
		// upload the rest of the blocks
		if (pushCount > 0) {
			for (let i = 0; i < pushCount; i++) {
				const extraBlocks = {
					children: extraArr[i],
				};

				console.log(extraBlocks)

				const extraResponse = await requestUrl({
					url: `https://api.notion.com/v1/blocks/${data.id}/children`,
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + notionAPI,
						"Notion-Version": "2022-06-28",
					},
					body: JSON.stringify(extraBlocks),
				});

				const extraData: any = await extraResponse.json;

				if (extraResponse.status !== 200) {
					new Notice(`Error ${extraData.status}: ${extraData.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
					console.log(`Error message: \n ${extraData.message}`);
				} else {
					console.log(`${i18nConfig["ExtraBlockUploaded"]} to page: ${data.id}`);
					if (i === pushCount - 1) {
						console.log(`${i18nConfig["BlockUploaded"]} to page: ${data.id}`);
						new Notice(`${i18nConfig["BlockUploaded"]} page: ${data.id}`, 5000);
					}
				}
			}
		}

		return {
			response,
			data
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
		const frontMatter =
			app.metadataCache.getFileCache(nowFile)?.frontmatter;
		const {abName} = this.dbDetails
		const notionIDKey = `NotionID-${abName}`;
		const notionID = frontMatter ? frontMatter[notionIDKey] : null;


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
			await updateYamlInfo(
				markdown,
				nowFile,
				data,
				app,
				this.plugin,
				this.dbDetails,
			);
		}

		return res;
	}
}
