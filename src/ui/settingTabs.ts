import {App, PluginSettingTab, Setting} from "obsidian";
import {i18nConfig} from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";

export interface PluginSettings {
    NextButton: boolean;
    notionAPINext: string;
    databaseIDNext: string;
    bannerUrl: string;
    notionUser: string;
    proxy: string;
	GeneralButton: boolean;
    notionAPIGeneral: string;
    databaseIDGeneral: string;
	CustomButton: boolean;
	notionAPICustom: string;
	databaseIDCustom: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    NextButton: true,
    notionAPINext: "",
    databaseIDNext: "",
    bannerUrl: "",
    notionUser: "",
    proxy: "",
	GeneralButton: true,
    notionAPIGeneral: "",
    databaseIDGeneral: "",
	CustomButton: false,
	notionAPICustom: "",
	databaseIDCustom: "",
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

        containerEl.createEl('h2', {text: i18nConfig.GeneralSetting})

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

        containerEl.createEl('h2', {text: i18nConfig.NotionNextSettingHeader})

		new Setting(containerEl)
			.setName(i18nConfig.NotionNextButton)
			.setDesc(i18nConfig.NotionNextButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.NextButton)
					.onChange(async (value) => {
						this.plugin.settings.NextButton = value;
						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();
					})
			);

        new Setting(containerEl)
            .setName(i18nConfig.NotionAPI)
            .setDesc(i18nConfig.NotionAPIDesc)
            .addText((text) => {
                text.inputEl.type = 'password';
                return text
                    .setPlaceholder(i18nConfig.NotionAPIText)
                    .setValue(this.plugin.settings.notionAPINext)
                    .onChange(async (value) => {
                        this.plugin.settings.notionAPINext = value;
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
                        .setValue(this.plugin.settings.databaseIDNext)
                        .onChange(async (value) => {
                            this.plugin.settings.databaseIDNext = value;
                            await this.plugin.saveSettings();
                        })
                }
            );

        // notionDatabaseID.controlEl.querySelector('input').type='password'


        // General Database Settings
        containerEl.createEl('h2', {text: i18nConfig.NotionGeneralSettingHeader});

        // new Setting(containerEl)
        //     .setName(i18nConfig.NotYetFinish)
		new Setting(containerEl)
			.setName(i18nConfig.NotionGeneralButton)
			.setDesc(i18nConfig.NotionGeneralButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.GeneralButton)
					.onChange(async (value) => {
						this.plugin.settings.GeneralButton = value;
						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();
					})
			);

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
        new Setting(containerEl)
            .setName(i18nConfig.NotionAPI)
            .setDesc(i18nConfig.NotionAPIDesc)
            .addText((text) => {
                text.inputEl.type = 'password';
                return text
                    .setPlaceholder(i18nConfig.NotionAPIText)
                    .setValue(this.plugin.settings.notionAPIGeneral)
                    .onChange(async (value) => {
                        this.plugin.settings.notionAPIGeneral = value;
                        await this.plugin.saveSettings();
                    })
            });


        new Setting(containerEl)
            .setName(i18nConfig.DatabaseID)
            .setDesc(i18nConfig.NotionAPIDesc)
            .addText((text) => {
                    text.inputEl.type = 'password';
                    return text
                        .setPlaceholder(i18nConfig.NotionIDText)
                        .setValue(this.plugin.settings.databaseIDGeneral)
                        .onChange(async (value) => {
                            this.plugin.settings.databaseIDGeneral = value;
                            await this.plugin.saveSettings();
                        })
                }
            );

		// Custom Database Settings

		// containerEl.createEl('h2', {text: i18nConfig.NotionCustomSettingHeader});
		//
		// new Setting(containerEl)
		// 	.setName(i18nConfig.NotionCustomButton)
		// 	.setDesc(i18nConfig.NotionCustomButtonDesc)
		// 	.addToggle((toggle) =>
		// 		toggle
		// 			.setValue(this.plugin.settings.CustomButton)
		// 			.onChange(async (value) => {
		// 				this.plugin.settings.CustomButton = value;
		// 				await this.plugin.saveSettings();
		// 			})
		// 	);
    }
}
