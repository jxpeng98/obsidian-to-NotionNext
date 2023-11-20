import { App, PluginSettingTab, Setting } from "obsidian";
import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";

export interface PluginSettings {
    NextButton: boolean;
    notionAPINext: string;
    databaseIDNext: string;
    bannerUrl: string;
    notionUser: string;
    proxy: string;
    GeneralButton: boolean;
	tagButton: boolean;
    CustomTitleButton: boolean;
    CustomTitleName: string;
    notionAPIGeneral: string;
    databaseIDGeneral: string;
    CustomButton: boolean;
    notionAPICustom: string;
    databaseIDCustom: string;
    [key: string]: any;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    NextButton: true,
    notionAPINext: "",
    databaseIDNext: "",
    bannerUrl: "",
    notionUser: "",
    proxy: "",
    GeneralButton: true,
	tagButton: true,
    CustomTitleButton: false,
    CustomTitleName: "",
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
        const { containerEl } = this;

        containerEl.empty();

        // General Settings
        containerEl.createEl('h2', { text: i18nConfig.GeneralSetting });

        this.createSettingEl(containerEl, i18nConfig.BannerUrl, i18nConfig.BannerUrlDesc, 'text', i18nConfig.BannerUrlText, this.plugin.settings.bannerUrl, 'bannerUrl')

        this.createSettingEl(containerEl, i18nConfig.NotionUser, i18nConfig.NotionUserDesc, 'text', i18nConfig.NotionUserText, this.plugin.settings.notionUser, 'notionUser')

        containerEl.createEl('h2', { text: i18nConfig.NotionNextSettingHeader })


        new Setting(containerEl)
            .setName(i18nConfig.NotionNextButton)
            .setDesc(i18nConfig.NotionNextButtonDesc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.NextButton)
                    .onChange(async (value) => {
                        this.plugin.settings.NextButton = value;

                        this.updateSettingEl(notionAPINextEl, value)

                        this.updateSettingEl(databaseIDNextEl, value)

                        await this.plugin.saveSettings();
                        await this.plugin.commands.updateCommand();
                    })
            );


        const notionAPINextEl = this.createStyleDiv('api-next', this.plugin.settings.NextButton)
        this.createSettingEl(notionAPINextEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.plugin.settings.notionAPINext, 'notionAPINext')

        const databaseIDNextEl = this.createStyleDiv('databaseID-next', this.plugin.settings.NextButton)
        this.createSettingEl(databaseIDNextEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.plugin.settings.databaseIDNext, 'databaseIDNext')


        // General Database Settings
        containerEl.createEl('h2', { text: i18nConfig.NotionGeneralSettingHeader });

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

						this.updateSettingEl(tagButtonEl, value)
                        this.updateSettingEl(CustomTitleEl, value)
                        // name should follow the result of the title button
                        if (value) {
                            this.updateSettingEl(CustomNameEl, this.plugin.settings.CustomTitleButton)
                        } else {
                            this.updateSettingEl(CustomNameEl, value)
                        }

                        this.updateSettingEl(notionAPIGeneralEl, value)
                        this.updateSettingEl(databaseIDGeneralEl, value)


                        await this.plugin.saveSettings();
                        await this.plugin.commands.updateCommand();

                    })
            );

		// add the tagButton to control whether to add tags to the general database
		const tagButtonEl = this.createStyleDiv('tag-button', (this.plugin.settings.GeneralButton && this.plugin.settings.CustomTitleButton));
		this.createSettingEl(tagButtonEl, i18nConfig.NotionTagButton, i18nConfig.NotionTagButtonDesc, 'toggle', i18nConfig.NotionCustomTitleText, this.plugin.settings.tagButton, 'tagButton')

		// Custom Title Button
        const CustomTitleEl = this.createStyleDiv('custom-title', this.plugin.settings.GeneralButton);
        new Setting(CustomTitleEl)
            .setName(i18nConfig.NotionCustomTitle)
            .setDesc(i18nConfig.NotionCustomTitleDesc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.CustomTitleButton)
                    .onChange(async (value) => {
                        this.plugin.settings.CustomTitleButton = value;

                        this.updateSettingEl(CustomNameEl, value)

                        await this.plugin.saveSettings();
                        await this.plugin.commands.updateCommand();
                    })
            );

		// Custom Title Name
        const CustomNameEl = this.createStyleDiv('custom-name', (this.plugin.settings.CustomTitleButton && this.plugin.settings.GeneralButton));
        this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.plugin.settings.CustomTitleName, 'CustomTitleName')

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

        const notionAPIGeneralEl = this.createStyleDiv('api-general', this.plugin.settings.GeneralButton);
        this.createSettingEl(notionAPIGeneralEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.plugin.settings.notionAPIGeneral, 'notionAPIGeneral')


        const databaseIDGeneralEl = this.createStyleDiv('databaseID-general', this.plugin.settings.GeneralButton);
        this.createSettingEl(databaseIDGeneralEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.plugin.settings.databaseIDGeneral, 'databaseIDGeneral')

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

    // create a function to create a div with a style for pop over elements
    private createStyleDiv(className: string, commandValue: boolean = false) {
        return this.containerEl.createDiv(className, (div) => {
            this.updateSettingEl(div, commandValue);
        });
    }
    // update the setting display style in the setting tab
    private updateSettingEl(element: HTMLElement, commandValue: boolean) {
        element.style.borderTop = commandValue ? "1px solid var(--background-modifier-border)" : "none";
        element.style.paddingTop = commandValue ? "0.75em" : "0";
        element.style.display = commandValue ? "block" : "none";
        element.style.alignItems = "center";
    }

    // function to add one setting element in the setting tab.
    private createSettingEl(containerEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any, settingsKey: string) {
        if (type === 'password') {
            return new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addText((text) => {
                    text.inputEl.type = type;
                    return text
                        .setPlaceholder(placeholder)
                        .setValue(holderValue)
                        .onChange(async (value) => {
                            this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
                            await this.plugin.saveSettings();
                        })
                });
        } else if (type === 'toggle') {
            return new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addToggle((toggle) =>
                    toggle
                        .setValue(holderValue)
                        .onChange(async (value) => {
                            this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
                            await this.plugin.saveSettings();
                            await this.plugin.commands.updateCommand();
                        })
                );
        } else if (type === 'text') {
            return new Setting(containerEl)
                .setName(name)
                .setDesc(desc)
                .addText((text) =>
                    text
                        .setPlaceholder(placeholder)
                        .setValue(holderValue)
                        .onChange(async (value) => {
                            this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
                            await this.plugin.saveSettings();
                            await this.plugin.commands.updateCommand();
                        })
                );
        }
    }

}
