import { UploadBaseNext } from "./BaseUpload2NotionNext";
import { App, Notice, requestUrl, TFile } from "obsidian";
import { Client } from '@notionhq/client';
import { markdownToBlocks, } from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";
import { updateYamlInfo } from "../updateYaml";
import {LIMITS, paragraph} from "@tryfabric/martian/src/notion";

export class Upload2NotionNext extends UploadBaseNext {
    settings: PluginSettings;
	dbDetails: DatabaseDetails

    constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
        super(plugin, dbDetails);
		this.dbDetails = dbDetails
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
        childArr: any
    ) {
        await this.deletePage(notionID)

		const { databaseID} = this.dbDetails

        const databaseCover = await this.getDataBase(databaseID)

        if (cover == null) {
            cover = databaseCover
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
        childArr: any
    ) {

		const {
			databaseID,
			notionAPI
		} = this.dbDetails


        const bodyString: any = {
            parent: {
                database_id: databaseID,
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
                type: {
                    select: {
                        name: type || 'Post'
                    }
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

		// add tags
		if (tags) {
			bodyString.properties.tags = {
				multi_select: tags.map(tag => {
					return { "name": tag }
				})
			}
		}

		// add title icon
		if (emoji) {
				bodyString.icon = {
					emoji: emoji
				}
		}

		// add slug
		if (slug) {
			bodyString.properties.slug = {
				rich_text: [
					{
						text: {
							content: slug
						}
					}
				]
			}
		}

		// check if summary is available
		if (summary) {
			bodyString.properties.summary = {
				rich_text: [
					{
						text: {
							content: summary
						}
					}
				]
			}
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
                    'Authorization': 'Bearer ' + notionAPI,
                    'Notion-Version': '2022-06-28',
                },
                body: JSON.stringify(bodyString),
            })
        } catch (error) {
            new Notice(`network error ${error}`)
        }
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
			}
		}
        let res: any
        const yamlContent: any = yamlFrontMatter.loadFront(markdown);
        const __content = yamlContent.__content
        const file2Block = markdownToBlocks(__content, options);
        const frontmasster = app.metadataCache.getFileCache(nowFile)?.frontmatter
		const {abName} = this.dbDetails
		const notionIDKey = `NotionID-${abName}`;
		const notionID = frontmasster ? frontmasster[notionIDKey] : null;


		// increase the limits
		// Motivated by https://github.com/tryfabric/martian/issues/51
		file2Block.forEach((block,index) => {
			if (
				block.type === 'paragraph' &&
				block.paragraph.rich_text.length > LIMITS.RICH_TEXT_ARRAYS
			) {

				const newParagraphBlocks: any[] = []
				const chunk:any = []
				const richTextChunks = chunk(block.paragraph.rich_text, 100)

				richTextChunks.forEach((chunk: any) => {
					newParagraphBlocks.push(paragraph(chunk))
				})

				file2Block.splice(index, 1, ...newParagraphBlocks)

			}
		})

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
                file2Block
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
                file2Block
            );
        }

        if (res.status === 200) {
            await updateYamlInfo(markdown, nowFile, res, app, this.plugin, this.dbDetails)
        } else {
            new Notice(`${res.text}`)
        }
        return res
    }
}

