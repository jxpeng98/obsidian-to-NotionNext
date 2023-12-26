import {
	Modal,
	Setting,
	PluginSettingTab,
	ButtonComponent, App
} from 'obsidian';

import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";
import {ObsidianSettingTab} from "./settingTabs";
import {SettingNextTabs} from "./settingNextTabs";
import {SettingGeneralTabs} from "./settingGeneralTabs";


export class SettingModal extends Modal {
	databaseFormat: string = 'none';
	databaseAbbreviateName: string = '';
	notionAPINext: string = '';
	databaseIDNext: string = '';
	GeneralButton: boolean = false;
	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab) {
		super(app);
		this.plugin = plugin;
		this.settingTab = settingTab;

	}

	display(): void {
		this.containerEl.addClass("settings-modal");

		// create the dropdown button to select the database format
		let { contentEl } = this;
		contentEl.empty();

		const settingDiv = contentEl.createDiv('setting-div');
		const nextTabs = contentEl.createDiv('next-tabs');


		new Setting(settingDiv)
			.setName(i18nConfig.databaseFormat)
			.setDesc(i18nConfig.databaseFormatDesc)
			.addDropdown((component) => {
				component
					.addOption('none', '')
					.addOption('general', i18nConfig.databaseGeneral)
					.addOption('next', i18nConfig.databaseNext)
					.addOption('custom', i18nConfig.databaseCustom)
					.setValue(this.databaseFormat)
					.onChange(async (value) => {
						this.databaseFormat = value;
						this.updateContentBasedOnSelection(value, nextTabs);
					});

				// Initialize content based on the current dropdown value
				this.updateContentBasedOnSelection(this.plugin.settings.databaseFormat, nextTabs);
			});
	}

	updateContentBasedOnSelection(value: string, nextTabs: HTMLElement): void {
		// Clear existing content
		nextTabs.empty();

		// Generate content based on the selected value
		if (value === 'general') {
			nextTabs.createEl('h3', { text: i18nConfig.NotionGeneralSettingHeader });

			// add abbreviate name
			new Setting(nextTabs)
				.setName(i18nConfig.databaseAbbreviateName)
				.setDesc(i18nConfig.databaseAbbreviateNameDesc)
				.addText((text) =>
					text
						.setPlaceholder(i18nConfig.databaseAbbreviateNameText)
						.setValue(this.databaseAbbreviateName)
						.onChange(async (value) => {
							this.databaseAbbreviateName = value;
						})
				);


			new Setting(nextTabs)
				.setName(i18nConfig.NotionGeneralButton)
				.setDesc(i18nConfig.NotionGeneralButtonDesc)
				.addToggle((toggle) =>
					toggle
						.setValue(this.GeneralButton)
						.onChange(async (value) => {
							this.GeneralButton = value;

							this.updateSettingEl(notionAPIGeneralEl, value)
							this.updateSettingEl(databaseIDGeneralEl, value)


						})
				);


			const notionAPIGeneralEl = this.createStyleDiv('api-general', this.plugin.settings.GeneralButton);

			new Setting(notionAPIGeneralEl)
				.setName(i18nConfig.NotionAPI)
				.setDesc(i18nConfig.NotionAPIDesc)
				.addText((text) => {
					text.inputEl.type = 'password';
					return text
						.setPlaceholder(i18nConfig.NotionAPIText)
						.setValue(this.notionAPINext)
						.onChange(async (value) => {
							this.notionAPINext = value; // Update the plugin settings directly
						})
				});


			const databaseIDGeneralEl = this.createStyleDiv('databaseID-general', this.plugin.settings.GeneralButton);

			new Setting(databaseIDGeneralEl)
				.setName(i18nConfig.DatabaseID)
				.setDesc(i18nConfig.NotionAPIDesc)
				.addText((text) => {
					text.inputEl.type = 'password';
					return text
						.setPlaceholder(i18nConfig.DatabaseIDText)
						.setValue(this.databaseIDNext)
						.onChange(async (value) => {
							this.databaseIDNext = value; // Update the plugin settings directly
						})
				});



		} else if (value === 'next') {
			nextTabs.createEl('h3', { text: i18nConfig.NotionNextSettingHeader });
			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.databaseAbbreviateName)

			new Setting(nextTabs)
				.setName(i18nConfig.databaseAbbreviateName)
				.setDesc(i18nConfig.databaseAbbreviateNameDesc)
				.addText((text) =>
					text
						.setPlaceholder(i18nConfig.databaseAbbreviateNameText)
						.setValue(this.databaseAbbreviateName)
						.onChange(async (value) => {
							this.databaseAbbreviateName = value;
						})
				);

			// add api key
			const notionAPINextEl = this.createStyleDiv('api-next', this.plugin.settings.NextButton)

			new Setting(notionAPINextEl)
				.setName(i18nConfig.NotionAPI)
				.setDesc(i18nConfig.NotionAPIDesc)
				.addText((text) => {
					text.inputEl.type = 'password';
					return text
						.setPlaceholder(i18nConfig.NotionAPIText)
						.setValue(this.notionAPINext)
						.onChange(async (value) => {
							this.notionAPINext = value; // Update the plugin settings directly
						})
				});

			// add database id
			const databaseIDNextEl = this.createStyleDiv('databaseID-next', this.plugin.settings.NextButton)

			new Setting(databaseIDNextEl)
				.setName(i18nConfig.DatabaseID)
				.setDesc(i18nConfig.NotionAPIDesc)
				.addText((text) => {
					text.inputEl.type = 'password';
					return text
						.setPlaceholder(i18nConfig.DatabaseIDText)
						.setValue(this.databaseIDNext)
						.onChange(async (value) => {
							this.databaseIDNext = value; // Update the plugin settings directly
						})
				});

			// // test button
			// new Setting(nextTabs)
			// 	.setName(i18nConfig.NotionNextButton)
			// 	.setDesc(i18nConfig.NotionNextButtonDesc)
			// 	.addToggle((toggle) =>
			// 		toggle
			// 			.setValue(this.plugin.settings.NextButton)
			// 			.onChange(async (value) => {
			// 				this.plugin.settings.NextButton = value;
			// 			})
			// 	);

		} else if (value === 'custom') {

		}
		// Implement for 'custom' if needed
	}



	onOpen() {
		// add console log to check if the modal is opened
		this.display()
	}



	// create a function to create a div with a style for pop over elements
	public createStyleDiv(className: string, commandValue: boolean = false) {
		return this.contentEl.createDiv(className, (div) => {
			this.updateSettingEl(div, commandValue);
		});
	}
	// update the setting display style in the setting tab
	public updateSettingEl(element: HTMLElement, commandValue: boolean) {
		element.style.borderTop = commandValue ? "1px solid var(--background-modifier-border)" : "none";
		element.style.paddingTop = commandValue ? "0.75em" : "0";
		element.style.display = commandValue ? "block" : "none";
		element.style.alignItems = "center";
	}

	// function to add one setting element in the setting tab.
	public createSettingEl(contentEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any) {
		if (type === 'password') {
			return new Setting(contentEl)
				.setName(name)
				.setDesc(desc)
				.addText((text) => {
					text.inputEl.type = type;
					return text
						.setPlaceholder(placeholder)
						.setValue(holderValue)
						.onChange(async (value) => {
							holderValue = value; // Update the plugin settings directly
							await this.plugin.saveSettings();
						})
				});
		} else if (type === 'toggle') {
			return new Setting(contentEl)
				.setName(name)
				.setDesc(desc)
				.addToggle((toggle) =>
					toggle
						.setValue(holderValue)
						.onChange(async (value) => {
							holderValue = value; // Update the plugin settings directly
							await this.plugin.saveSettings();
						})
				);
		} else if (type === 'text') {
			return new Setting(contentEl)
				.setName(name)
				.setDesc(desc)
				.addText((text) =>
					text
						.setPlaceholder(placeholder)
						.setValue(holderValue)
						.onChange(async (value) => {
							holderValue = value; // Update the plugin settings directly
							await this.plugin.saveSettings();
						})
				);
		}
	}
}
