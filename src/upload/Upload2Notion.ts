import { App, TFile } from "obsidian";
import { markdownToBlocks } from "@jxpeng98/martian";
import * as yamlFrontMatter from "yaml-front-matter";
import { LIMITS, paragraph } from "@jxpeng98/martian";
import MyPlugin from "src/main";
import { DatabaseDetails } from "../ui/settingTabs";
import { updateYamlInfo } from "./updateYaml";
import { UploadBase, NotionPageResponse } from "./common/UploadBase";

export type DatasetType = "general" | "next" | "custom";

interface BaseSyncRequest {
	dataset: DatasetType;
	markdown: string;
	nowFile: TFile;
	app: App;
}

interface GeneralSyncRequest extends BaseSyncRequest {
	dataset: "general";
	title: string;
	cover: string;
	tags: string[];
}

interface NextSyncRequest extends BaseSyncRequest {
	dataset: "next";
	title: string;
	emoji: string;
	cover: string;
	tags: string[];
	type: string;
	slug: string;
	stats: string;
	category: string;
	summary: string;
	password: string;
	favicon: string;
	datetime: string;
}

interface CustomSyncRequest extends BaseSyncRequest {
	dataset: "custom";
	cover: string;
	customValues: Record<string, string>;
}

export type SyncRequest =
	| GeneralSyncRequest
	| NextSyncRequest
	| CustomSyncRequest;

interface GeneralParams {
	title: string;
	cover?: string;
	tags: string[];
	childArr: any[];
	notionId?: string;
}

interface NextParams {
	title: string;
	emoji: string;
	cover?: string;
	tags: string[];
	type: string;
	slug: string;
	stats: string;
	category: string;
	summary: string;
	password: string;
	favicon: string;
	datetime: string;
	childArr: any[];
	notionId?: string;
}

interface CustomParams {
	cover?: string;
	customValues: Record<string, string>;
	childArr: any[];
	notionId?: string;
}

export class Upload2Notion extends UploadBase {

	constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
		super(plugin, dbDetails);
	}

	async sync(request: SyncRequest): Promise<NotionPageResponse> {
		const startedAt = Date.now();

		let response: NotionPageResponse;

		switch (request.dataset) {
			case "general":
				response = await this.handleGeneral(request);
				break;
			case "next":
				response = await this.handleNext(request);
				break;
			case "custom":
				response = await this.handleCustom(request);
				break;
			default:
				throw new Error(`Unsupported dataset type: ${(request as any).dataset}`);
		}

		if (response.response && response.response.status === 200) {
			await updateYamlInfo(
				request.markdown,
				request.nowFile,
				response.data,
				request.app,
				this.plugin,
				this.dbDetails,
			);
		} else {
			console.log(`[Upload2Notion] Sync failed`, response.data);
		}

		return response;
	}

	private async handleGeneral(request: GeneralSyncRequest): Promise<NotionPageResponse> {
		console.log(`[Upload2Notion] Handling general dataset`, {
			cover: request.cover,
			tags: request.tags,
		});
		const blocks = this.buildBlocks(request.markdown, {
			notionLimits: {truncate: false},
		});
		const notionId = this.getNotionId(request.app, request.nowFile);
		this.debugLog("Upload2Notion", "General dataset payload prepared", {
			blockCount: blocks.length,
			notionId: notionId ?? null,
			tagCount: request.tags?.length ?? 0,
		});

		return this.upsertGeneral({
			title: request.title,
			cover: request.cover,
			tags: request.tags || [],
			childArr: blocks,
			notionId,
		});
	}

	private async handleNext(request: NextSyncRequest): Promise<NotionPageResponse> {
		console.log(`[Upload2Notion] Handling next dataset`, {
			type: request.type,
			slug: request.slug,
			category: request.category,
		});
		const blocks = this.buildBlocks(request.markdown, {
			notionLimits: {truncate: false},
		});
		this.splitRichTextParagraphs(blocks);
		const notionId = this.getNotionId(request.app, request.nowFile);
		this.debugLog("Upload2Notion", "Next dataset payload prepared", {
			blockCount: blocks.length,
			notionId: notionId ?? null,
			hasEmoji: !!request.emoji,
			tags: request.tags || [],
		});

		return this.upsertNext({
			title: request.title,
			emoji: request.emoji,
			cover: request.cover,
			tags: request.tags || [],
			type: request.type,
			slug: request.slug,
			stats: request.stats,
			category: request.category,
			summary: request.summary,
			password: request.password,
			favicon: request.favicon,
			datetime: request.datetime,
			childArr: blocks,
			notionId,
		});
	}

	private async handleCustom(request: CustomSyncRequest): Promise<NotionPageResponse> {
		console.log(`[Upload2Notion] Handling custom dataset`, {
			customKeys: Object.keys(request.customValues || {}),
		});
		const blocks = this.buildBlocks(request.markdown, {
			strictImageUrls: true,
			notionLimits: {truncate: false},
		});
		const notionId = this.getNotionId(request.app, request.nowFile);
		this.debugLog("Upload2Notion", "Custom dataset payload prepared", {
			blockCount: blocks.length,
			notionId: notionId ?? null,
			customValueKeys: Object.keys(request.customValues || {}),
		});

		return this.upsertCustom({
			cover: request.cover,
			customValues: request.customValues,
			childArr: blocks,
			notionId,
		});
	}

	private buildBlocks(markdown: string, options: Record<string, unknown>): any[] {
		const yamlContent: any = yamlFrontMatter.loadFront(markdown);
		const content = yamlContent.__content;
		const blocks = markdownToBlocks(content, options);
		this.debugLog("Upload2Notion", "Converted markdown to blocks", {
			blockCount: blocks.length,
			firstBlockTypes: blocks.slice(0, 5).map((block: any) => block?.type),
			options,
		});
		return blocks;
	}

	private getNotionId(app: App, nowFile: TFile): string | undefined {
		const frontMatter = app.metadataCache.getFileCache(nowFile)?.frontmatter;
		if (!frontMatter) {
			this.debugLog("Upload2Notion", "No frontmatter found when resolving Notion ID", {
				filePath: nowFile.path,
			});
			return undefined;
		}
		const {abName} = this.dbDetails;
		const notionIDKey = `NotionID-${abName}`;
		const notionId = frontMatter[notionIDKey];
		return notionId ? String(notionId) : undefined;
	}

	private splitRichTextParagraphs(blocks: any[]): void {
		blocks.forEach((block, index) => {
			if (
				block.type === "paragraph" &&
				block.paragraph.rich_text.length > LIMITS.RICH_TEXT_ARRAYS
			) {
				console.log(`[Upload2Notion] Splitting rich text paragraph`, {
					index,
					length: block.paragraph.rich_text.length,
				});
				const paragraphChunks = this.chunkArray<any>(block.paragraph.rich_text, 100);
				const newParagraphBlocks = paragraphChunks.map((chunk) => paragraph(chunk));
				blocks.splice(index, 1, ...newParagraphBlocks);
			}
		});
	}

	private chunkArray<T>(items: T[], size: number): T[][] {
		const result: T[][] = [];
		for (let i = 0; i < items.length; i += size) {
			result.push(items.slice(i, i + size));
		}
		return result;
	}

	private async upsertGeneral(params: GeneralParams): Promise<NotionPageResponse> {
		const {firstChunk, extraChunks} = this.prepareBlocks(params.childArr);
		const cover = params.notionId
			? await this.resolveCoverForUpdate(params.cover)
			: params.cover;
		this.debugLog("Upload2Notion", "Upserting general page", {
			title: params.title,
			blockCount: params.childArr.length,
			firstChunkSize: firstChunk.length,
			extraChunkCount: extraChunks.length,
			cover: cover ?? null,
			notionIdExisting: params.notionId ?? null,
			tagList: params.tags,
		});

		if (params.notionId) {
			console.log(`[Upload2Notion] Deleting existing Notion page`, {
				notionId: params.notionId,
			});
			await this.deletePage(params.notionId);
		}

		const body = this.buildGeneralBody({
			title: params.title,
			tags: params.tags,
			firstChunk,
		});
		this.applyCover(body, cover);
		console.log(body);
		return this.submitPage(body, extraChunks);
	}

	private async upsertNext(params: NextParams): Promise<NotionPageResponse> {
		const {firstChunk, extraChunks} = this.prepareBlocks(params.childArr);
		const cover = params.notionId
			? await this.resolveCoverForUpdate(params.cover)
			: params.cover;
		this.debugLog("Upload2Notion", "Upserting NotionNext page", {
			title: params.title,
			type: params.type,
			slug: params.slug,
			blockCount: params.childArr.length,
			firstChunkSize: firstChunk.length,
			extraChunkCount: extraChunks.length,
			cover: cover ?? null,
			hasEmoji: !!params.emoji,
			notionIdExisting: params.notionId ?? null,
		});

		if (params.notionId) {
			await this.deletePage(params.notionId);
		}

		const body = this.buildNextBody({
			firstChunk,
			title: params.title,
			emoji: params.emoji,
			tags: params.tags,
			type: params.type,
			slug: params.slug,
			stats: params.stats,
			category: params.category,
			summary: params.summary,
			password: params.password,
			favicon: params.favicon,
			datetime: params.datetime,
		});
		this.applyCover(body, cover);
		console.log(body);
		return this.submitPage(body, extraChunks);
	}

	private async upsertCustom(params: CustomParams): Promise<NotionPageResponse> {
		const {firstChunk, extraChunks} = this.prepareBlocks(params.childArr);
		const cover = params.notionId
			? await this.resolveCoverForUpdate(params.cover)
			: params.cover;
		this.debugLog("Upload2Notion", "Upserting custom page", {
			blockCount: params.childArr.length,
			firstChunkSize: firstChunk.length,
			extraChunkCount: extraChunks.length,
			cover: cover ?? null,
			notionIdExisting: params.notionId ?? null,
			customValueKeys: Object.keys(params.customValues || {}),
		});

		if (params.notionId) {
			await this.deletePage(params.notionId);
		}

		const body = this.buildCustomBody({
			customValues: params.customValues,
			firstChunk,
		});
		this.applyCover(body, cover);
		console.log(body);
		return this.submitPage(body, extraChunks);
	}

	private buildGeneralBody(params: {title: string; tags: string[]; firstChunk: any[]}): any {
		const {
			databaseID,
			customTitleButton,
			customTitleName,
			tagButton,
		} = this.dbDetails;

		return {
			parent: {
				database_id: databaseID,
			},
			properties: {
				[customTitleButton ? customTitleName : "title"]: {
					title: [
						{
							text: {
								content: params.title,
							},
						},
					],
				},
				...(tagButton
					? {
						tags: {
							multi_select:
								params.tags && params.tags.length > 0
									? params.tags.map((tag) => ({name: tag}))
									: [],
						},
					}
					: {}),
			},
			children: params.firstChunk,
		};
	}

	private buildNextBody(params: {
		firstChunk: any[];
		title: string;
		emoji: string;
		tags: string[];
		type: string;
		slug: string;
		stats: string;
		category: string;
		summary: string;
		password: string;
		favicon: string;
		datetime: string;
	}): any {
		const {databaseID} = this.dbDetails;

		const pageProperties: any = {
			parent: {
				database_id: databaseID,
			},
			properties: {
				title: {
					title: [
						{
							text: {
								content: params.title,
							},
						},
					],
				},
				type: {
					select: {
						name: params.type || "Post",
					},
				},
				status: {
					select: {
						name: params.stats || "Draft",
					},
				},
				category: {
					select: {
						name: params.category || "Obsidian",
					},
				},
				password: {
					rich_text: [
						{
							text: {
								content: params.password || "",
							},
						},
					],
				},
				icon: {
					rich_text: [
						{
							text: {
								content: params.favicon || "",
							},
						},
					],
				},
				date: {
					date: {
						start: params.datetime || new Date().toISOString(),
					},
				},
			},
		};

		if (params.tags && params.tags.length > 0) {
			pageProperties.properties.tags = {
				multi_select: params.tags.map((tag) => ({name: tag})),
			};
		}

		if (params.emoji) {
			pageProperties.icon = {
				emoji: params.emoji,
			};
		}

		if (params.slug) {
			pageProperties.properties.slug = {
				rich_text: [
					{
						text: {
							content: params.slug,
						},
					},
				],
			};
		}

		if (params.summary) {
			pageProperties.properties.summary = {
				rich_text: [
					{
						text: {
							content: params.summary,
						},
					},
				],
			};
		}

		return {
			...pageProperties,
			children: params.firstChunk,
		};
	}

	private buildCustomBody(params: {
		customValues: Record<string, string>;
		firstChunk: any[];
	}): any {
		const {customProperties, databaseID} = this.dbDetails;
		const properties: { [key: string]: any } = {};

		if (customProperties) {
			customProperties.forEach(({customName, customType}) => {
				if (params.customValues[customName] !== undefined) {
					const propertyValue = this.buildCustomProperty(customName, customType, params.customValues);
					if (propertyValue !== undefined) {
						properties[customName] = propertyValue;
					}
				}
			});
		}

		return {
			parent: {
				database_id: databaseID,
			},
			properties,
			children: params.firstChunk,
		};
	}

	private buildCustomProperty(customName: string, customType: string, customValues: Record<string, any>) {
		const value = customValues[customName] || "";

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
								content: value || "",
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
					files: Array.isArray(value)
						? value.map((url: string) => ({
							name: url,
							type: "external",
							external: {
								url,
							},
						}))
						: [
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
					multi_select: Array.isArray(value)
						? value.map((item: string) => ({name: item}))
						: [{name: value}],
				};
			case "relation":
				return {
					relation: Array.isArray(value)
						? value.map((item: string) => ({id: item}))
						: [{id: value}],
				};
			default:
				return undefined;
		}
	}
}
