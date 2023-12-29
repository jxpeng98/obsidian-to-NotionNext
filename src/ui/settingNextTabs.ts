import {App, PluginSettingTab, Setting} from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import {i18nConfig} from "../lang/I18n";
import {ObsidianSettingTab} from "./settingTabs";
import {SettingModal} from "./settingModal";

export class SettingNextTabs extends PluginSettingTab {
	plugin: ObsidianSyncNotionPlugin;
	settingModal: SettingModal;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {

		// notion next database settings
		this.containerEl.createEl('h2', { text: i18nConfig.NotionNextSettingHeader });

		const NextButtonEl = this.containerEl.createDiv();

		new Setting(NextButtonEl)
			.setName(i18nConfig.NotionNextButton)
			.setDesc(i18nConfig.NotionNextButtonDesc)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.NextButton)
					.onChange(async (value) => {
						this.plugin.settings.NextButton = value;

						this.settingModal.updateSettingEl(notionAPINextEl, value)

						this.settingModal.updateSettingEl(databaseIDNextEl, value)

						await this.plugin.saveSettings();
						await this.plugin.commands.updateCommand();
					})
			);


		const notionAPINextEl = this.settingModal.createStyleDiv('api-next', this.plugin.settings.NextButton,NextButtonEl)
		this.settingModal.createSettingEl(notionAPINextEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.plugin.settings.notionAPINext,'notionAPINext')

		const databaseIDNextEl = this.settingModal.createStyleDiv('databaseID-next', this.plugin.settings.NextButton,NextButtonEl)
		this.settingModal.createSettingEl(databaseIDNextEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.plugin.settings.databaseIDNext,'databaseIDNext')
	}

}
