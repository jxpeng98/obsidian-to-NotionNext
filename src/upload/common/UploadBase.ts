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
		});
	}

	protected prepareBlocks(childArr: any[]): PreparedBlocks {
		this.stripCodeAnnotations(childArr);

		const childArrLength = childArr.length;
		console.log(`Page includes ${childArrLength} blocks`);

		if (childArrLength <= 100) {
			return {
				firstChunk: childArr,
				extraChunks: [],
			};
		}

		const extraChunks: any[][] = [];
		for (let i = 100; i < childArr.length; i += 100) {
			extraChunks.push(childArr.slice(i, i + 100));
		}

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
	}

	protected async resolveCoverForUpdate(cover?: string): Promise<string | undefined> {
		if (cover) {
			return cover;
		}
		const databaseCover = await this.fetchDatabaseCover();
		return databaseCover ?? undefined;
	}

	protected async submitPage(body: any, extraChunks: any[][]): Promise<NotionPageResponse> {
		const {notionAPI} = this.dbDetails;

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
		});

		const data = await response.json;

		if (response.status !== 200) {
			new Notice(`Error ${data.status}: ${data.code} \n ${i18nConfig["CheckConsole"]}`, 5000);
			console.log(`Error message: \n ${data.message}`);
		} else {
			console.log(`Page created: ${data.url}`);
			console.log(`Page ID: ${data.id}`);
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

			console.log(extraBlocks);

			const extraResponse = await requestUrl({
				url: `https://api.notion.com/v1/blocks/${pageId}/children`,
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + notionAPI,
					"Notion-Version": "2022-06-28",
				},
				body: JSON.stringify(extraBlocks),
			});

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
		});

		if (response.json.cover && response.json.cover.external) {
			return response.json.cover.external.url;
		}

		return null;
	}
}
