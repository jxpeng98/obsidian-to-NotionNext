import {i18nConfig} from "../lang/I18n";
import {App, Notice} from "obsidian";
import {Upload2Notion} from "./Upload2Notion";
import {DatabaseDetails, PluginSettings} from "../ui/settingTabs";
import ObsidianSyncNotionPlugin from "../main";
import {getNowFileMarkdownContentNext} from "./common/getMarkdownNext";
import {getNowFileMarkdownContentGeneral} from "./common/getMarkdownGeneral";
import {getNowFileMarkdownContentCustom} from "./common/getMarkdownCustom";

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
	} = await getNowFileMarkdownContentNext(app, settings)

	if (markDownData) {
		const {basename} = nowFile;

		const upload = new Upload2Notion(plugin, dbDetails);
		const res = await upload.sync({
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

		const {response} = res;
		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			console.log(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`);
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
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

		const upload = new Upload2Notion(plugin, dbDetails);
		const res = await upload.sync({
			dataset: "general",
			title: basename,
			cover: cover || "",
			tags: tags || [],
			markdown: markDownData,
			nowFile,
			app,
		});

		const {response} = res;
		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			console.log(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`);
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
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

		const upload = new Upload2Notion(plugin, dbDetails);
		const res = await upload.sync({
			dataset: "custom",
			cover: cover || "",
			customValues,
			markdown: markDownData,
			nowFile,
			app,
		});

		const {response} = res;

		if (response.status === 200) {
			new Notice(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`).noticeEl.style.color = "green";
			console.log(`${i18nConfig["sync-preffix"]} ${basename} ${i18nConfig["sync-success"]}`);
		} else {
			new Notice(`${i18nConfig["sync-fail"]} ${basename}`, 5000);
			console.log(`${i18nConfig["sync-fail"]} ${basename}`);
		}

	}
}
