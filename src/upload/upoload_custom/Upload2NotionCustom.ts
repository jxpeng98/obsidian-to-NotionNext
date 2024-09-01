import {App, Notice, Platform, TFile, requestUrl} from "obsidian";
import {markdownToBlocks} from "@jxpeng98/martian";
import * as yamlFrontMatter from "yaml-front-matter";
import MyPlugin from "src/main";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";
import {updateYamlInfo} from "../updateYaml";
import {UploadBaseCustom} from "./BaseUpload2NotionCustom";
// import fetch from 'node-fetch';
import {i18nConfig} from "../../lang/I18n";


interface CreatePageResponse {
	response: any;
	data: any;
}

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

		const {databaseID} = this.dbDetails;

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
	): Promise<CreatePageResponse> {

		const {
			databaseID,
			customProperties,
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

		const bodyString: any = this.buildBodyString(customProperties, customValues, firstArr);

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
		console.log(Platform.isDesktopApp)

		let response: any;
		let data: any;

		if (Platform.isMobileApp) {
			if(childArrLength > 100) {
				new Notice(i18nConfig["reach-mobile-limit"], 5000);
			} else {
				response =  await requestUrl({
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
			}
		}

		// if (Platform.isDesktopApp) {
		// 	 response = await fetch("https://api.notion.com/v1/pages", {
		// 		method: "POST",
		// 		headers: {
		// 			"Content-Type": "application/json",
		// 			"Authorization": "Bearer " + notionAPI,
		// 			"Notion-Version": "2022-06-28",
		// 		},
		// 		body: JSON.stringify(bodyString),
		// 	});
		//
		// 	data = await response.json();
		//
		// 	if (!response.ok) {
		// 		new Notice(`Error ${data.status}: ${data.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
		// 		console.log(`Error message: \n ${data.message}`);
		// 	} else {
		// 		console.log(`Page created: ${data.url}`);
		// 		console.log(`Page ID: ${data.id}`);
		// 	}
		//
		// 	// upload the rest of the blocks
		// 	if (pushCount > 0) {
		// 		for (let i = 0; i < pushCount; i++) {
		// 			const extraBlocks = {
		// 				children: extraArr[i],
		// 			};
		//
		// 			console.log(extraBlocks)
		//
		// 			const extraResponse = await fetch(`https://api.notion.com/v1/blocks/${data.id}/children`, {
		// 				method: "PATCH",
		// 				headers: {
		// 					"Content-Type": "application/json",
		// 					"Authorization": "Bearer " + notionAPI,
		// 					"Notion-Version": "2022-06-28",
		// 				},
		// 				body: JSON.stringify(extraBlocks),
		// 			});
		//
		// 			const extraData: any = await extraResponse.json();
		//
		// 			if (!extraResponse.ok) {
		// 				new Notice(`Error ${extraData.status}: ${extraData.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
		// 				console.log(`Error message: \n ${extraData.message}`);
		// 			} else {
		// 				console.log(`${i18nConfig["ExtraBlockUploaded"]} to page: ${data.id}`);
		// 				if (i === pushCount - 1) {
		// 					console.log(`${i18nConfig["BlockUploaded"]} to page: ${data.id}`);
		// 					new Notice(`${i18nConfig["BlockUploaded"]} page: ${data.id}`, 5000);
		// 				}
		// 			}
		// 		}
		// 	}
		// }

		return {
			response, // for status code
			data // for id and url
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
		const frontMatter =
			app.metadataCache.getFileCache(nowFile)?.frontmatter;
		const {abName} = this.dbDetails
		const notionIDKey = `NotionID-${abName}`;
		const notionID = frontMatter ? frontMatter[notionIDKey] : null;

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

		let {response, data} = res;

		// console.log(response)

		if (Platform.isDesktopApp) {
			if (response && response.status === 200) {
				await updateYamlInfo(
					markdown,
					nowFile,
					data,
					app,
					this.plugin,
					this.dbDetails
				);
			}
		}

		if (Platform.isMobileApp) {
			if (response && response.status === 200) {
				await updateYamlInfo(
					markdown,
					nowFile,
					response,
					app,
					this.plugin,
					this.dbDetails,
				);
			}
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
					multi_select: Array.isArray(value) ? value.map(item => ({name: item})) : [{name: value}],
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
		customProperties.forEach(({customName, customType}) => {
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
