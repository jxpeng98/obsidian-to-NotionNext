import {
	Modal,
	Setting,
	PluginSettingTab,
	ButtonComponent
} from 'obsidian';

import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";

export class SettingModal extends Modal {
	plugin: ObsidianSyncNotionPlugin;

	constructor(plugin: ObsidianSyncNotionPlugin) {
		super(plugin.app);
		this.plugin = plugin;
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.addClass('sync-to-notion-modal');

		new Setting(contentEl)
			.setName(i18nConfig.GeneralSetting)
			.setDesc(i18nConfig.GeneralSetting)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enableNotionNext)
					.onChange(async (value) => {
						this.plugin.settings.enableNotionNext = value;
						await this.plugin.saveSettings();
					});
			})
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enableNotionGeneral)
					.onChange(async (value) => {
						this.plugin.settings.enableNotionGeneral = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(contentEl)
			.setName(i18nConfig.NotionNextSettingHeader)
			.setDesc(i18nConfig.NotionNextSettingHeader)
			.addText((text) => {
				text
					.setPlaceholder(i18nConfig.NotionAPI)
					.setValue(this.plugin.settings.notionAPI)
					.onChange(async (value) => {
						this.plugin.settings.notionAPI = value;
						await this.plugin.saveSettings();
					});
			})
			.addText((text) => {
				text
					.setPlaceholder(i18nConfig.DatabaseID)
					.setValue(this.plugin.settings.databaseIDNext)
					.onChange(async (value) => {
						this.plugin.settings.databaseIDNext = value;
						await this.plugin.saveSettings();
					});
			})
			.addText((text) => {
				text
					.setPlaceholder(i18nConfig.BannerUrl)
					.setValue(this.plugin.settings.bannerUrl)
					.onChange(async (value) => {
						this.plugin.settings.bannerUrl = value;
						await this.plugin.saveSettings();
					});
			})
			.addText((text) => {
				text
					.setPlaceholder(i18nConfig.NotionUser)
					.setValue(this.plugin.settings.notionUser)
					.onChange(async (value) => {
						this.plugin.settings.notionUser = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(contentEl)
	}

}
