import {UploadBaseNext} from "./BaseUpload2NotionNext";
import {App, Notice, TFile, Platform, requestUrl} from "obsidian";
import {markdownToBlocks} from "@jxpeng98/martian";
import * as yamlFrontMatter from "yaml-front-matter";
import MyPlugin from "src/main";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";
import {updateYamlInfo} from "../updateYaml";
import {LIMITS, paragraph} from "@jxpeng98/martian/src/notion";
// import fetch from 'node-fetch';
import {i18nConfig} from "../../lang/I18n";

interface CreatePageResponse {
	response: any;
	data: any;
}

export class Upload2NotionNext extends UploadBaseNext {
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
		emoji: string,
		cover: string,
		tags: string[],
		type: string,
		slug: string,
		stats: string,
		category: string,
		summary: string,
		paword: string,
		favicon: string,
		datetime: string,
		childArr: any,
	) {
		await this.deletePage(notionID);

		const {databaseID} = this.dbDetails;

		const databaseCover = await this.getDataBase(databaseID);

		if (cover == null) {
			cover = databaseCover;
		}

		return await this.createPage(
			title,
			emoji,
			cover,
			tags,
			type,
			slug,
			stats,
			category,
			summary,
			paword,
			favicon,
			datetime,
			childArr,
		);
	}

	async createPage(
		title: string,
		emoji: string,
		cover: string,
		tags: string[],
		type: string,
		slug: string,
		stats: string,
		category: string,
		summary: string,
		pawrod: string,
		favicon: string,
		datetime: string,
		childArr: any,
	): Promise<CreatePageResponse> {
		const {databaseID, notionAPI} = this.dbDetails;

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

		// check the length of the childArr
		// if it is too long, split it into multiple pages
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

		const pageProperties: any = {
			parent: {
				database_id: databaseID,
			},
			properties: {
				title: {
					title: [
						{
							text: {
								content: title,
							},
						},
					],
				},
				type: {
					select: {
						name: type || "Post",
					},
				},
				status: {
					select: {
						name: stats || "Draft",
					},
				},
				category: {
					select: {
						name: category || "Obsidian",
					},
				},

				password: {
					rich_text: [
						{
							text: {
								content: pawrod || "",
							},
						},
					],
				},
				icon: {
					rich_text: [
						{
							text: {
								content: favicon || "",
							},
						},
					],
				},
				date: {
					date: {
						start: datetime || new Date().toISOString(),
					},
				},
			},
		};

		// add tags
		if (tags) {
			pageProperties.properties.tags = {
				multi_select: tags.map((tag) => {
					return {name: tag};
				}),
			};
		}

		// add title icon
		if (emoji) {
			pageProperties.icon = {
				emoji: emoji,
			};
		}

		// add slug
		if (slug) {
			pageProperties.properties.slug = {
				rich_text: [
					{
						text: {
							content: slug,
						},
					},
				],
			};
		}

		// check if summary is available
		if (summary) {
			pageProperties.properties.summary = {
				rich_text: [
					{
						text: {
							content: summary,
						},
					},
				],
			};
		}

		if (cover) {
			pageProperties.cover = {
				type: "external",
				external: {
					url: cover,
				},
			};
		}

		if (!pageProperties.cover && this.plugin.settings.bannerUrl) {
			pageProperties.cover = {
				type: "external",
				external: {
					url: this.plugin.settings.bannerUrl,
				},
			};
		}

		const bodyString: any = {
			...pageProperties,
			children: firstArr,
		};

		console.log(bodyString);

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
		// 	response = await fetch("https://api.notion.com/v1/pages", {
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
			response,
			data
		};
	}

	async syncMarkdownToNotionNext(
		title: string,
		emoji: string,
		cover: string,
		tags: string[],
		type: string,
		slug: string,
		stats: string,
		category: string,
		summary: string,
		paword: string,
		favicon: string,
		datetime: string,
		markdown: string,
		nowFile: TFile,
		app: App,
	): Promise<any> {
		const options = {
			notionLimits: {
				truncate: false,
			},
		};
		let res: any;
		const yamlContent: any = yamlFrontMatter.loadFront(markdown);
		const __content = yamlContent.__content;
		const file2Block = markdownToBlocks(__content, options);
		const frontmatter =
			app.metadataCache.getFileCache(nowFile)?.frontmatter;
		const {abName} = this.dbDetails;
		const notionIDKey = `NotionID-${abName}`;
		const notionID = frontmatter ? frontmatter[notionIDKey] : null;

		// increase the limits
		// Motivated by https://github.com/tryfabric/martian/issues/51
		file2Block.forEach((block, index) => {
			if (
				block.type === "paragraph" &&
				block.paragraph.rich_text.length > LIMITS.RICH_TEXT_ARRAYS
			) {
				const newParagraphBlocks: any[] = [];
				const chunk: any = [];
				const richTextChunks = chunk(block.paragraph.rich_text, 100);

				richTextChunks.forEach((chunk: any) => {
					newParagraphBlocks.push(paragraph(chunk));
				});

				file2Block.splice(index, 1, ...newParagraphBlocks);
			}
		});

		if (notionID) {
			res = await this.updatePage(
				notionID,
				title,
				emoji,
				cover,
				tags,
				type,
				slug,
				stats,
				category,
				summary,
				paword,
				favicon,
				datetime,
				file2Block,
			);
		} else {
			res = await this.createPage(
				title,
				emoji,
				cover,
				tags,
				type,
				slug,
				stats,
				category,
				summary,
				paword,
				favicon,
				datetime,
				file2Block,
			);
		}

		let {response, data} = res;

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
}
