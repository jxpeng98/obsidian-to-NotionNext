import {App, PluginSettingTab, Setting} from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import {i18nConfig} from "../lang/I18n";
import {ObsidianSettingTab} from "./settingTabs";

export class SettingGeneralTabs extends PluginSettingTab {
	plugin: ObsidianSyncNotionPlugin;
	private settingTab: ObsidianSettingTab;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab) {
		super(app, plugin);
		this.plugin = plugin;
		this.settingTab = settingTab;
	}

	display(): void {

		// General Database Settings
		this.settingTab.containerEl.createEl('h2', { text: i18nConfig.NotionGeneralSettingHeader });

		// new Setting(containerEl)
		//     .setName(i18nConfig.NotYetFinish)
		new Setting(this.settingTab.containerEl)
			.setName(i18nConfig.NotionGeneralButton)
			.setDesc(i18nConfig.NotionGeneralButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.GeneralButton)
					.onChange(async (value) => {
						this.plugin.settings.GeneralButton = value;

						this.settingTab.updateSettingEl(tagButtonEl, value)
						this.settingTab.updateSettingEl(CustomTitleEl, value)
						// name should follow the result of the title button
						if (value) {
							this.settingTab.updateSettingEl(CustomNameEl, this.plugin.settings.CustomTitleButton)
							this.settingTab.updateSettingEl(CustomValuesEl, this.plugin.settings.CustomTitleButton)
						} else {
							this.settingTab.updateSettingEl(CustomNameEl, value)
							this.settingTab.updateSettingEl(CustomValuesEl, value)
						}

						this.settingTab.updateSettingEl(notionAPIGeneralEl, value)
						this.settingTab.updateSettingEl(databaseIDGeneralEl, value)


						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();

					})
			);

		// add the tagButton to control whether to add tags to the general database
		const tagButtonEl = this.settingTab.createStyleDiv('tag-button', (this.plugin.settings.GeneralButton && this.plugin.settings.CustomTitleButton));
		this.settingTab.createSettingEl(tagButtonEl, i18nConfig.NotionTagButton, i18nConfig.NotionTagButtonDesc, 'toggle', i18nConfig.NotionCustomTitleText, this.plugin.settings.tagButton, 'tagButton')

		// Custom Title Button
		const CustomTitleEl = this.settingTab.createStyleDiv('custom-title', this.plugin.settings.GeneralButton);
		new Setting(CustomTitleEl)
			.setName(i18nConfig.NotionCustomTitle)
			.setDesc(i18nConfig.NotionCustomTitleDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.CustomTitleButton)
					.onChange(async (value) => {
						this.plugin.settings.CustomTitleButton = value;

						this.settingTab.updateSettingEl(CustomNameEl, value)

						this.settingTab.updateSettingEl(CustomValuesEl, value)

						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();
					})
			);

		// Custom Title Name
		const CustomNameEl = this.settingTab.createStyleDiv('custom-name', (this.plugin.settings.CustomTitleButton && this.plugin.settings.GeneralButton));
		this.settingTab.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.plugin.settings.CustomTitleName, 'CustomTitleName')

		// Custom database properties
		const CustomValuesEl = this.settingTab.createStyleDiv('custom-values', (this.plugin.settings.CustomTitleButton && this.plugin.settings.GeneralButton));
		new Setting(CustomValuesEl)
			.setName(i18nConfig.NotionCustomValues)
			.setDesc(i18nConfig.NotionCustomValuesDesc)
			.addTextArea((text) =>
				text
					.setPlaceholder(i18nConfig.NotionCustomValuesText)
					.setValue(this.plugin.settings.CustomValues)
					.onChange(async (value) => {
						this.plugin.settings.CustomValues = value;
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

		const notionAPIGeneralEl = this.settingTab.createStyleDiv('api-general', this.plugin.settings.GeneralButton);
		this.settingTab.createSettingEl(notionAPIGeneralEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.plugin.settings.notionAPIGeneral, 'notionAPIGeneral')


		const databaseIDGeneralEl = this.settingTab.createStyleDiv('databaseID-general', this.plugin.settings.GeneralButton);
		this.settingTab.createSettingEl(databaseIDGeneralEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.plugin.settings.databaseIDGeneral, 'databaseIDGeneral')
	}

}
