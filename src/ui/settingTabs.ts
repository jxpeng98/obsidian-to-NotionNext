import {App, PluginSettingTab, Setting} from "obsidian";
import {i18nConfig} from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";

export interface PluginSettings {
    NNon: boolean;
    notionAPI: string;
    databaseID: string;
    bannerUrl: string;
    notionUser: string;
    proxy: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    NNon: undefined,
    notionAPI: "",
    databaseID: "",
    bannerUrl: "",
    notionUser: "",
    proxy: "",
};


export class ObsidianSettingTab extends PluginSettingTab {
    plugin: ObsidianSyncNotionPlugin;

    constructor(app: App, plugin: ObsidianSyncNotionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName(i18nConfig.NotionNextVersion)
            .setDesc(i18nConfig.NotionNextVersionDesc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.NNon)
                    .onChange(async (value) => {
                        this.plugin.settings.NNon = value;
                        await this.plugin.saveSettings();
                    })
            );

        containerEl.createEl('h2', {text: i18nConfig.NotionNextSetting})

        new Setting(containerEl)
            .setName(i18nConfig.NotionAPI)
            .setDesc(i18nConfig.NotionAPIDesc)
            .addText((text) => {
                text.inputEl.type = 'password';
                return text
                    .setPlaceholder(i18nConfig.NotionAPIText)
                    .setValue(this.plugin.settings.notionAPI)
                    .onChange(async (value) => {
                        this.plugin.settings.notionAPI = value;
                        await this.plugin.saveSettings();
                    })
            });


        const notionDatabaseID = new Setting(containerEl)
            .setName(i18nConfig.DatabaseID)
            .setDesc(i18nConfig.NotionAPIDesc)
            .addText((text) => {
                    text.inputEl.type = 'password';
                    return text
                        .setPlaceholder(i18nConfig.DatabaseIDText)
                        .setValue(this.plugin.settings.databaseID)
                        .onChange(async (value) => {
                            this.plugin.settings.databaseID = value;
                            await this.plugin.saveSettings();
                        })
                }
            );

        // notionDatabaseID.controlEl.querySelector('input').type='password'

        new Setting(containerEl)
            .setName(i18nConfig.BannerUrl)
            .setDesc(i18nConfig.BannerUrlDesc)
            .addText((text) =>
                text
                    .setPlaceholder(i18nConfig.BannerUrlText)
                    .setValue(this.plugin.settings.bannerUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerUrl = value;
                        await this.plugin.saveSettings();
                    })
            );


        new Setting(containerEl)
            .setName(i18nConfig.NotionUser)
            .setDesc(i18nConfig.NotionUserDesc)
            .addText((text) =>
                text
                    .setPlaceholder(i18nConfig.NotionUserText)
                    .setValue(this.plugin.settings.notionUser)
                    .onChange(async (value) => {
                        this.plugin.settings.notionUser = value;
                        await this.plugin.saveSettings();
                    })
            );

        // General Database Settings
        containerEl.createEl('h2', {text: i18nConfig.NotionGeneralSetting});

        new Setting(containerEl)
            .setName(i18nConfig.NotYetFinish)

        // new Setting(containerEl)
        // .setName("Convert tags(optional)")
        // .setDesc("Transfer the Obsidian tags to the Notion table. It requires the column with the name 'Tags'")
        // .addToggle((toggle) =>
        // 	toggle
        // 		.setValue(this.plugin.settings.allowTags)
        // 		.onChange(async (value) => {
        // 			this.plugin.settings.allowTags = value;
        // 			await this.plugin.saveSettings();
        // 		})
        // );
    }
}
