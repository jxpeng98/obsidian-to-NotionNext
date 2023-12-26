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
					.setValue(this.plugin.settings.databaseFormat)
					.onChange(async (value) => {
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
			nextTabs.createEl('h2', { text: i18nConfig.NotionGeneralSettingHeader });
			// Additional content for 'general'...
		} else if (value === 'next') {
			nextTabs.createEl('h2', { text: i18nConfig.NotionNextSettingHeader });
			// Additional content for 'next'...
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
	public createSettingEl(contentEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any, settingsKey: string) {
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
							this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
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
							this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
							await this.plugin.saveSettings();
							await this.plugin.commands.updateCommand();
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
							this.plugin.settings[settingsKey] = value; // Update the plugin settings directly
							await this.plugin.saveSettings();
							await this.plugin.commands.updateCommand();
						})
				);
		}
	}
}
