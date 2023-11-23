import { i18nConfig } from "../lang/I18n";
import { App, Notice } from "obsidian";
import { Upload2NotionNext } from "./upload_next/Upload2NotionNext";
import { Upload2NotionGeneral } from "./upload_general/Upload2NotionGeneral";
import { Upload2NotionCustom } from "./upoload_custom/Upload2NotionCustom";
import { PluginSettings } from "../ui/settingTabs";
import ObsidianSyncNotionPlugin from "../main";
import { getNowFileMarkdownContentNext } from "./upload_next/getMarkdownNext";
import { getNowFileMarkdownContentGeneral } from "./upload_general/getMarkdownGeneral";
import {getNowFileMarkdownContentCustom} from "./upoload_custom/getMarkdownCustom";

export async function uploadCommandNext(
    plugin: ObsidianSyncNotionPlugin,
    settings: PluginSettings,
    app: App,
) {

    const { notionAPINext, databaseIDNext } = settings;

    // Check if NNon exists
    // if (NNon === undefined) {
    //     const NNonmessage = i18nConfig.NNonMissing;
    //     new Notice(NNonmessage);
    //     return;
    // }

    // Check if the user has set up the Notion API and database ID
    if (notionAPINext === "" || databaseIDNext === "") {
        const setAPIMessage = i18nConfig["set-api-id"];
        new Notice(setAPIMessage);
        return;
    }

    const { markDownData, nowFile, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime } = await getNowFileMarkdownContentNext(app, settings)

    if (markDownData) {
        const { basename } = nowFile;
        const upload = new Upload2NotionNext(plugin);
        const res = await upload.syncMarkdownToNotionNext(basename, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, markDownData, nowFile, this.app);

        if (res.status === 200) {
            new Notice(`${i18nConfig["sync-success"]}${basename}`);
        } else {
            new Notice(`${i18nConfig["sync-fail"]}${basename}`, 5000);
        }

    }
}



export async function uploadCommandGeneral(
    plugin: ObsidianSyncNotionPlugin,
    settings: PluginSettings,
    app: App,
) {

    const { notionAPIGeneral, databaseIDGeneral } = settings;

    // Check if the user has set up the Notion API and database ID
    if (notionAPIGeneral === "" || databaseIDGeneral === "") {
        const setAPIMessage = i18nConfig["set-api-id"];
        new Notice(setAPIMessage);
        return;
    }

    const { markDownData, nowFile, cover, tags } = await getNowFileMarkdownContentGeneral(app, settings)

    if (markDownData) {
        const { basename } = nowFile;

        const upload = new Upload2NotionGeneral(plugin);
        const res = await upload.syncMarkdownToNotionGeneral(basename, cover, tags, markDownData, nowFile, this.app);

        if (res.status === 200) {
            new Notice(`${i18nConfig["sync-success"]}${basename}`);
        } else {
            new Notice(`${i18nConfig["sync-fail"]}${basename}`, 5000);
        }

    }
}


export async function uploadCommandCustom(
    plugin: ObsidianSyncNotionPlugin,
    settings: PluginSettings,
    app: App,
) {

    const { notionAPIGeneral, databaseIDGeneral } = settings;

    // Check if the user has set up the Notion API and database ID
    if (notionAPIGeneral === "" || databaseIDGeneral === "") {
        const setAPIMessage = i18nConfig["set-api-id"];
        new Notice(setAPIMessage);
        return;
    }

    const { markDownData, nowFile, cover, tags ,customValues} = await getNowFileMarkdownContentCustom(app, settings)

    if (markDownData) {
        const { basename } = nowFile;

        const upload = new Upload2NotionCustom(plugin);
        const res = await upload.syncMarkdownToNotionCustom(basename, cover, tags, customValues, markDownData, nowFile, this.app);

        if (res.status === 200) {
            new Notice(`${i18nConfig["sync-success"]}${basename}`);
        } else {
            new Notice(`${i18nConfig["sync-fail"]}${basename}`, 5000);
        }

    }
}
