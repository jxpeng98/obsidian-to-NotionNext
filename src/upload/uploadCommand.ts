import {i18nConfig} from "../lang/I18n";
import {App, Notice} from "obsidian";
import {Upload2Notion} from "./Upload2Notion";
import type {NotionPageResponse} from "./common/UploadBase";
import {DatabaseDetails, PluginSettings} from "../ui/settingTabs";
import ObsidianSyncNotionPlugin from "../main";
import {getNowFileMarkdownContentNext} from "./common/getMarkdownNext";
import {getNowFileMarkdownContentGeneral} from "./common/getMarkdownGeneral";
import {getNowFileMarkdownContentCustom} from "./common/getMarkdownCustom";

const SYNC_ERROR_NOTICE_DURATION = 8000;

function extractErrorMessage(error: unknown): string {
	if (error instanceof Error && error.message) {
		return error.message;
	}
	return String(error);
}

function notifySyncError(prefix: string, basename: string, error: unknown): void {
	const errorMessage = extractErrorMessage(error);
	console.error(`${prefix} Sync failed`, error);
	new Notice(
		`${i18nConfig["sync-fail"]} ${basename}. ${errorMessage}\n${i18nConfig["CheckConsole"]}`,
		SYNC_ERROR_NOTICE_DURATION,
	);
}

function logCommandDebug(context: string, message: string, payload?: Record<string, unknown>): void {
	if (payload) {
		console.log(`[${context}] ${message}`, payload);
	} else {
		console.log(`[${context}] ${message}`);
	}
}

export async function uploadCommandNext(
	plugin: ObsidianSyncNotionPlugin,
	settings: PluginSettings,
	dbDetails: DatabaseDetails,
	app: App,
) {

	const {notionAPI, databaseID} = dbDetails;
	console.log(`[uploadCommandNext] ${new Date().toISOString()} Triggered for file`, app.workspace.getActiveFile()?.path);

	// Check if the user has set up the Notion API and database ID
	if (notionAPI === "" || databaseID === "") {
		const setAPIMessage = i18nConfig["set-api-id"];
		new Notice(setAPIMessage);
		return;
	}

	const {
		markDownData,
		nowFile,
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
		datetime
	} = await getNowFileMarkdownContentNext(app, settings);

	logCommandDebug("uploadCommandNext", "Metadata extracted from markdown", {
		hasMarkdown: !!markDownData,
		markdownLength: markDownData?.length ?? 0,
		tagCount: tags?.length ?? 0,
		coverIncluded: !!cover,
		hasEmoji: !!emoji,
		type,
		slug,
		hasPassword: !!paword,
		datetime,
	});

	if (markDownData) {
		const {basename} = nowFile;
		logCommandDebug("uploadCommandNext", "Preparing to upload", {
			filename: basename,
			filePath: nowFile.path,
		});

		const upload = new Upload2Notion(plugin, dbDetails);
		let res: NotionPageResponse;
		try {
			res = await upload.sync({
				dataset: "next",
				title: basename,
				emoji: emoji || "",
				cover: cover || "",
				tags: tags || [],
				type: type || "",
				slug: slug || "",
				stats: stats || "",
				category: category || "",
				summary: summary || "",
				password: paword || "",
				favicon: favicon || "",
				datetime: datetime || "",
				markdown: markDownData,
				nowFile,
				app,
			});
		} catch (error: unknown) {
			notifySyncError("[uploadCommandNext]", basename, error);
			logCommandDebug("uploadCommandNext", "Sync threw error", {
				filename: basename,
				error: extractErrorMessage(error),
			});
			return;
		}

		const {response} = res;
		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			
			logCommandDebug("uploadCommandNext", "Sync succeeded", {
				filename: basename,
				status: response.status,
				pageId: res.data?.id ?? null,
				pageUrl: res.data?.url ?? null,
			});
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
			logCommandDebug("uploadCommandNext", "Sync failed with status", {
				filename: basename,
				status: response.status,
				errorCode: res.data?.code ?? null,
				errorStatus: res.data?.status ?? null,
			});
		}

	}
}


export async function uploadCommandGeneral(
	plugin: ObsidianSyncNotionPlugin,
	settings: PluginSettings,
	dbDetails: DatabaseDetails,
	app: App,
) {

	const {notionAPI, databaseID} = dbDetails;
	console.log(`[uploadCommandGeneral] ${new Date().toISOString()} Triggered for file`, app.workspace.getActiveFile()?.path);

	// Check if the user has set up the Notion API and database ID
	if (notionAPI === "" || databaseID === "") {
		const setAPIMessage = i18nConfig["set-api-id"];
		new Notice(setAPIMessage);
		return;
	}

	const {markDownData, nowFile, cover, tags} = await getNowFileMarkdownContentGeneral(app, settings)

	new Notice(`Start upload ${nowFile.basename}`);
	console.log(`Start upload ${nowFile.basename}`);

	if (markDownData) {
		const {basename} = nowFile;
		logCommandDebug("uploadCommandGeneral", "Preparing to upload", {
			filename: basename,
			markdownLength: markDownData.length,
			tagCount: tags?.length ?? 0,
			hasCover: !!cover,
		});

		const upload = new Upload2Notion(plugin, dbDetails);
		let res: NotionPageResponse;
		try {
			res = await upload.sync({
				dataset: "general",
				title: basename,
				cover: cover || "",
				tags: tags || [],
				markdown: markDownData,
				nowFile,
				app,
			});
		} catch (error: unknown) {
			notifySyncError("[uploadCommandGeneral]", basename, error);
			logCommandDebug("uploadCommandGeneral", "Sync threw error", {
				filename: basename,
				error: extractErrorMessage(error),
			});
			return;
		}

		const {response} = res;
		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			
			logCommandDebug("uploadCommandGeneral", "Sync succeeded", {
				filename: basename,
				status: response.status,
				pageId: res.data?.id ?? null,
				pageUrl: res.data?.url ?? null,
			});
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
			logCommandDebug("uploadCommandGeneral", "Sync failed with status", {
				filename: basename,
				status: response.status,
				errorCode: res.data?.code ?? null,
				errorStatus: res.data?.status ?? null,
			});
		}

	}
}


export async function uploadCommandCustom(
	plugin: ObsidianSyncNotionPlugin,
	settings: PluginSettings,
	dbDetails: DatabaseDetails,
	app: App,
) {

	const {notionAPI, databaseID} = dbDetails;
	console.log(`[uploadCommandCustom] ${new Date().toISOString()} Triggered for file`, app.workspace.getActiveFile()?.path);

	// Check if the user has set up the Notion API and database ID
	if (notionAPI === "" || databaseID === "") {
		const setAPIMessage = i18nConfig["set-api-id"];
		new Notice(setAPIMessage);
		return;
	}

	const {markDownData, nowFile, cover, customValues} = await getNowFileMarkdownContentCustom(app, dbDetails)

	new Notice(`Start upload ${nowFile.basename}`);
	console.log(`Start upload ${nowFile.basename}`);

	if (markDownData) {
		const {basename} = nowFile;
		logCommandDebug("uploadCommandCustom", "Preparing to upload", {
			filename: basename,
			markdownLength: markDownData.length,
			hasCover: !!cover,
			customValueKeys: Object.keys(customValues || {}),
		});

		const upload = new Upload2Notion(plugin, dbDetails);
		let res: NotionPageResponse;
		try {
			res = await upload.sync({
				dataset: "custom",
				cover: cover || "",
				customValues,
				markdown: markDownData,
				nowFile,
				app,
			});
		} catch (error: unknown) {
			notifySyncError("[uploadCommandCustom]", basename, error);
			logCommandDebug("uploadCommandCustom", "Sync threw error", {
				filename: basename,
				error: extractErrorMessage(error),
			});
			return;
		}

		const {response} = res;

		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			
			logCommandDebug("uploadCommandCustom", "Sync succeeded", {
				filename: basename,
				status: response.status,
				pageId: res.data?.id ?? null,
				pageUrl: res.data?.url ?? null,
			});
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
			logCommandDebug("uploadCommandCustom", "Sync failed with status", {
				filename: basename,
				status: response.status,
				errorCode: res.data?.code ?? null,
				errorStatus: res.data?.status ?? null,
			});
		}

	}
}
