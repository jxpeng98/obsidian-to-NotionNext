import {i18nConfig} from "../lang/I18n";
import {App, Notice} from "obsidian";
import {getNowFileMarkdownContent} from "./getMarkdown";
import {Upload2NotionNext} from "./Upload2NotionNext";
import {Upload2NotionGeneral} from "./Upload2NotionGeneral";
import {PluginSettings} from "../ui/settingTabs";
import ObsidianSyncNotionPlugin from "../main";

export async function uploadCommand(
    plugin: ObsidianSyncNotionPlugin,
    settings: PluginSettings,
    app: App,
) {

    const {notionAPI, databaseID, NNon} = settings;

    // Check if NNon exists
    if (NNon === undefined) {
        const NNonmessage = i18nConfig.NNonMissing;
        new Notice(NNonmessage);
        return;
    }

    // Check if the user has set up the Notion API and database ID
    if (notionAPI === "" || databaseID === "") {
        const setAPIMessage = i18nConfig["set-api-id"];
        new Notice(setAPIMessage);
        return;
    }

    const {markDownData, nowFile, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime} = await getNowFileMarkdownContent(app, settings)

    if (markDownData) {
        const {basename} = nowFile;
        let upload;
        let res;

        if (NNon) {
            upload = new Upload2NotionNext(plugin);
            res = await upload.syncMarkdownToNotionNext(basename, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, markDownData, nowFile, this.app, this.settings);
        } else {
            upload = new Upload2NotionGeneral(plugin);
            res = await upload.syncMarkdownToNotionGeneral(basename, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, markDownData, nowFile, this.app, this.settings);
        }


        if (res.status === 200) {
            new Notice(`${i18nConfig["sync-success"]}${basename}`);
        } else {
            new Notice(`${i18nConfig["sync-fail"]}${basename}`, 5000);
        }

    }
}
