import {UploadBase} from "./BaseUpload2Notion";
import { App, Notice, requestUrl, TFile } from "obsidian";
import { Client } from '@notionhq/client';
import { markdownToBlocks, } from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";

export class Upload2Notion extends UploadBase {
	constructor(plugin: MyPlugin) {
        super(plugin);
	}

	// 因为需要解析notion的block进行对比，非常的麻烦，
	// 暂时就直接删除，新建一个page
	async updatePage(notionID: string, title: string, emoji: string, cover: string, tags: string[], type: string, slug: string, stats: string, category: string, summary: string, paword: string, favicon: string, datetime: string, childArr: any) {
		await this.deletePage(notionID)

		const databasecover = await this.getDataBase(this.plugin.settings.databaseID)

		if (cover == null) {
			cover = databasecover
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
			childArr)
	}

	async createPage(title: string, emoji: string, cover: string, tags: string[], type: string, slug: string, stats: string, category: string, summary: string, pawrod: string, favicon: string, datetime: string, childArr: any) {
		const bodyString: any = {
			parent: {
				database_id: this.plugin.settings.databaseID
			},
			icon: {
				emoji: emoji || '📜'
			},
			properties: {
				title: {
					title: [
						{
							text: {
								content: title
							},
						},
					],
				},
				tags: {
					multi_select: tags && true ? tags.map(tag => {
						return { "name": tag }
					}) : [],
				},
				type: {
					select: {
						name: type || 'Post'
					}
				},
				slug: {
					rich_text: [
						{
							text: {
								content: slug || ''
							}
						}
					]
				},
				status: {
					select: {
						name: stats || 'Draft'
					}
				},
				category: {
					select: {
						name: category || 'Obsidian'
					}
				},
				summary: {
					rich_text: [
						{
							text: {
								content: summary || ''
							}
						}
					]
				},
				password: {
					rich_text: [
						{
							text: {
								content: pawrod || ''
							}
						}
					]
				},
				icon: {
					rich_text: [
						{
							text: {
								content: favicon || ''
							}
						}
					]
				},
				date: {
					date: {
						start: datetime || new Date().toISOString()
					}
				}
			},
			children: childArr,
		}
		if (cover) {
			bodyString.cover = {
				type: "external",
				external: {
					url: cover
				}
			}
		}

		if (!bodyString.cover && this.plugin.settings.bannerUrl) {
			bodyString.cover = {
				type: "external",
				external: {
					url: this.plugin.settings.bannerUrl
				}
			}
		}

		try {
			return await requestUrl({
				url: `https://api.notion.com/v1/pages`,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					// 'User-Agent': 'obsidian.md',
					'Authorization': 'Bearer ' + this.plugin.settings.notionAPI,
					'Notion-Version': '2022-06-28',
				},
				body: JSON.stringify(bodyString),
			})
		} catch (error) {
			new Notice(`network error ${error}`)
		}
	}

	async syncMarkdownToNotion(title: string, emoji: string, cover: string, tags: string[], type: string, slug: string, stats: string, category: string, summary: string, paword: string, favicon: string, datetime: string, markdown: string, nowFile: TFile, app: App, settings: any): Promise<any> {
		let res: any
		const yamlContent: any = yamlFrontMatter.loadFront(markdown);
		const __content = yamlContent.__content
		const file2Block = markdownToBlocks(__content);
		const frontmasster = app.metadataCache.getFileCache(nowFile)?.frontmatter
		const notionID = frontmasster ? frontmasster.notionID : null

		if (notionID) {
			res = await this.updatePage(notionID, title, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, file2Block);
		} else {
			res = await this.createPage(title, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, file2Block);
		}
		if (res.status === 200) {
			await this.updateYamlInfo(markdown, nowFile, res, app, settings)
		} else {
			new Notice(`${res.text}`)
		}
		return res
	}
}
