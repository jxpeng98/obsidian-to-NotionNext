import {App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting} from "obsidian";
import {addIcons} from 'src/ui/icon';
import {Upload2NotionGeneral} from "src/upload/Upload2NotionGeneral";
import {Upload2NotionNext} from "src/upload/Upload2NotionNext";
import {i18nConfig} from "src/lang/I18n";
import ribbonCommands from "src/commands/NotionCommands";
import { ObsidianSettingTab, PluginSettings, DEFAULT_SETTINGS } from "src/ui/settingTabs";
import {getNowFileMarkdownContent} from "src/upload/getMarkdown";
// Remember to rename these classes and interfaces!


export default class ObsidianSyncNotionPlugin extends Plugin {
    settings: PluginSettings;
    commands: ribbonCommands;
    app: App;

    async onload() {
        await this.loadSettings();
        this.commands = new ribbonCommands(this);

        addIcons();
        // This creates an icon in the left ribbon.
        const ribbonIconEl = this.addRibbonIcon(
            "notion-logo",
            i18nConfig.ribbonIcon,
            async (evt: MouseEvent) => {
                // Called when the user clicks the icon.
                // await this.uploadCommand();
                this.commands.ribbonDisplay();
            }
        );

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.

        // const statusBarItemEl = this.addStatusBarItem();
        // // statusBarItemEl.setText("share to notion");

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObsidianSettingTab(this.app, this));

    }

    onunload() {
    }

    // async uploadCommand() {
    //     const {notionAPI, databaseID, NNon} = this.settings;
    //
    //     // Check if NNon exists
    //     if (NNon === undefined) {
    //         const NNonmessage = i18nConfig.NNonMissing;
    //         new Notice(NNonmessage);
    //         return;
    //     }
    //
    //     // Check if the user has set up the Notion API and database ID
    //     if (notionAPI === "" || databaseID === "") {
    //         const setAPIMessage = i18nConfig["set-api-id"];
    //         new Notice(setAPIMessage);
    //         return;
    //     }
    //
    //     const {markDownData, nowFile, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime} = await getNowFileMarkdownContent(this.app, this.settings)
    //
    //     if (markDownData) {
    //         const {basename} = nowFile;
    //         let upload;
    //         let res;
    //
    //         if (NNon) {
    //             upload = new Upload2NotionNext(this);
    //             res = await upload.syncMarkdownToNotionNext(basename, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, markDownData, nowFile, this.app, this.settings);
    //         } else {
    //             upload = new Upload2NotionGeneral(this);
    //             res = await upload.syncMarkdownToNotionGeneral(basename, emoji, cover, tags, type, slug, stats, category, summary, paword, favicon, datetime, markDownData, nowFile, this.app, this.settings);
    //         }
    //
    //
    //         if (res.status === 200) {
    //             new Notice(`${i18nConfig["sync-success"]}${basename}`);
    //         } else {
    //             new Notice(`${i18nConfig["sync-fail"]}${basename}`, 5000);
    //         }
    //     }
    // }


    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

}




