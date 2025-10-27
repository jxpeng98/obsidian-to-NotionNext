import { Notice, requestUrl } from "obsidian";
import MyPlugin from "src/main";
import { DatabaseDetails } from "../../ui/settingTabs";
import { i18nConfig } from "../../lang/I18n";

export interface NotionPageResponse {
	response: any;
	data: any;
}

interface PreparedBlocks {
	firstChunk: any[];
	extraChunks: any[][];
}

export abstract class UploadBase {
	protected plugin: MyPlugin;
	protected dbDetails: DatabaseDetails;

	protected constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
		this.plugin = plugin;
		this.dbDetails = dbDetails;
	}

	async deletePage(notionID: string) {
		const {notionAPI} = this.dbDetails;
		return requestUrl({
			url: `https://api.notion.com/v1/blocks/${notionID}`,
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + notionAPI,
				"Notion-Version": "2022-06-28",
			},
			body: "",
			throw: false,
		}).catch((error) =>
			this.handleRequestError(error, `Deleting Notion page ${notionID}`),
		);
	}

	protected prepareBlocks(childArr: any[]): PreparedBlocks {
		this.stripCodeAnnotations(childArr);

		const childArrLength = childArr.length;

		if (childArrLength <= 100) {
			this.debugLog("UploadBase", "Blocks fit into a single request", {
				totalBlocks: childArrLength,
			});
			return {
				firstChunk: childArr,
				extraChunks: [],
			};
		}

		const extraChunks: any[][] = [];
		for (let i = 100; i < childArr.length; i += 100) {
			extraChunks.push(childArr.slice(i, i + 100));
		}

		this.debugLog("UploadBase", "Blocks split into multiple chunks", {
			totalBlocks: childArrLength,
			firstChunkSize: 100,
			extraChunkCount: extraChunks.length,
			lastChunkSize: extraChunks[extraChunks.length - 1].length,
		});

		return {
			firstChunk: childArr.slice(0, 100),
			extraChunks,
		};
	}

	protected applyCover(body: any, cover?: string) {
		if (cover) {
			body.cover = {
				type: "external",
				external: {
					url: cover,
				},
			};
		} else if (!body.cover && this.plugin.settings.bannerUrl) {
			body.cover = {
				type: "external",
				external: {
					url: this.plugin.settings.bannerUrl,
				},
			};
		}

		this.debugLog("UploadBase", "Cover applied to payload", {
			chosenCover: body.cover?.external?.url ?? null,
			defaultBannerUsed: !cover && !!this.plugin.settings.bannerUrl,
		});
	}

	protected async resolveCoverForUpdate(cover?: string): Promise<string | undefined> {
		if (cover) {
			this.debugLog("UploadBase", "Existing cover retained for update", {
				cover,
			});
			return cover;
		}
		const databaseCover = await this.fetchDatabaseCover();
		return databaseCover ?? undefined;
	}

	protected async submitPage(body: any, extraChunks: any[][]): Promise<NotionPageResponse> {
		const {notionAPI} = this.dbDetails;
		const startedAt = Date.now();

		const response = await requestUrl({
			url: `https://api.notion.com/v1/pages`,
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + notionAPI,
				"Notion-Version": "2022-06-28",
			},
			body: JSON.stringify(body),
			throw: false,
		}).catch((error) =>
			this.handleRequestError(error, "Creating Notion page"),
		);

		const data = await response.json;
		this.debugLog("UploadBase", "Page creation response received", {
			status: response.status,
			durationMs: Date.now() - startedAt,
			notionUrl: data?.url ?? null,
			pageId: data?.id ?? null,
		});

		if (response.status !== 200) {
			new Notice(`Error ${data.status}: ${data.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
			console.log(`Error message: \n ${data.message}`);
		} else {
			if (extraChunks.length > 0) {
				await this.appendExtraBlocks(data.id, extraChunks);
			}
		}

		return {response, data};
	}

	private stripCodeAnnotations(childArr: any[]) {
		childArr.forEach((block: any) => {
			if (block.type === "code") {
				block.code.rich_text.forEach((item: any) => {
					if (item.type === "text" && item.annotations) {
						delete item.annotations;
					}
				});
			}
		});
	}

	private async appendExtraBlocks(pageId: string, extraChunks: any[][]) {
		const {notionAPI} = this.dbDetails;

		for (let i = 0; i < extraChunks.length; i++) {
			const chunk = extraChunks[i];
			const extraBlocks = {
				children: chunk,
			};

			const extraResponse = await requestUrl({
				url: `https://api.notion.com/v1/blocks/${pageId}/children`,
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + notionAPI,
					"Notion-Version": "2022-06-28",
				},
				body: JSON.stringify(extraBlocks),
				throw: false,
			}).catch((error) =>
				this.handleRequestError(error, `Appending blocks to page ${pageId}`),
			);

			const extraData: any = await extraResponse.json;

			if (extraResponse.status !== 200) {
				new Notice(`Error ${extraData.status}: ${extraData.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
				console.log(`Error message: \n ${extraData.message}`);
			} else {
				console.log(`${i18nConfig["ExtraBlockUploaded"]} to page: ${pageId}`);
				if (i === extraChunks.length - 1) {
					console.log(`${i18nConfig["BlockUploaded"]} to page: ${pageId}`);
					new Notice(`${i18nConfig["BlockUploaded"]} page: ${pageId}`, 5000);
				}
			}
		}
	}

	private async fetchDatabaseCover(): Promise<string | null> {
		const {notionAPI, databaseID} = this.dbDetails;
		const response = await requestUrl({
			url: `https://api.notion.com/v1/databases/${databaseID}`,
			method: "GET",
			headers: {
				Authorization: "Bearer " + notionAPI,
				"Notion-Version": "2022-06-28",
			},
			throw: false,
		}).catch((error) =>
			this.handleRequestError(error, `Fetching database ${databaseID}`),
		);

		if (response.json.cover && response.json.cover.external) {
			return response.json.cover.external.url;
		}

		return null;
	}

	protected debugLog(context: string, message: string, payload?: Record<string, unknown>): void {
		if (payload) {
			console.log(`[${context}] ${message}`, payload);
		} else {
			console.log(`[${context}] ${message}`);
		}
	}

	protected maskValue(value?: string, visibleChars = 4): string | undefined {
		if (!value) {
			return value;
		}
		if (value.length <= visibleChars * 2) {
			return `${value.slice(0, visibleChars)}***`;
		}
		return `${value.slice(0, visibleChars)}***${value.slice(-visibleChars)}`;
	}

	private handleRequestError(error: unknown, context: string): never {
		const message = error instanceof Error && error.message
			? error.message
			: String(error);
		console.error(`[UploadBase] ${context} failed`, {
			message,
			error,
		});
		throw new Error(
			`${context} failed: ${message}. Please check your network connection or proxy settings.`,
		);
	}
}
