import {App, PluginSettingTab, Setting} from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import {i18nConfig} from "../lang/I18n";
import {ObsidianSettingTab} from "./settingTabs";

export class SettingNextTab extends PluginSettingTab {
	plugin: ObsidianSyncNotionPlugin;
	private settingTab: ObsidianSettingTab;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab) {
		super(app, plugin);
		this.plugin = plugin;
		this.settingTab = settingTab;
	}

	display(): void {

		// notion next database settings

		this.settingTab.containerEl.createEl('h2', { text: i18nConfig.NotionNextSettingHeader })

		new Setting(this.settingTab.containerEl)
			.setName(i18nConfig.NotionNextButton)
			.setDesc(i18nConfig.NotionNextButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.NextButton)
					.onChange(async (value) => {
						this.plugin.settings.NextButton = value;

						this.settingTab.updateSettingEl(notionAPINextEl, value)

						this.settingTab.updateSettingEl(databaseIDNextEl, value)

						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();
					})
			);


		const notionAPINextEl = this.settingTab.createStyleDiv('api-next', this.plugin.settings.NextButton)
		this.settingTab.createSettingEl(notionAPINextEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.plugin.settings.notionAPINext, 'notionAPINext')

		const databaseIDNextEl = this.settingTab.createStyleDiv('databaseID-next', this.plugin.settings.NextButton)
		this.settingTab.createSettingEl(databaseIDNextEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.plugin.settings.databaseIDNext, 'databaseIDNext')
	}

}
