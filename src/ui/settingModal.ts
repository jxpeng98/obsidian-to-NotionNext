import {
	Modal,
	Setting,
	ButtonComponent, App
} from 'obsidian';

import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";
import { DatabaseDetails, ObsidianSettingTab } from "./settingTabs";

export interface customProperty {
	customName: string;
	customType: string;
	index: number;
}

export class SettingModal extends Modal {
	propertyLines: Setting[] = []; // Store all property line settings
	properties: customProperty[] = []; // Array to store property values and types
	[key: string]: any; // Index signature
	data: Record<string, any> = {
		databaseFormat: 'none',
		databaseFullName: '',
		databaseAbbreviateName: '',
		notionAPI: '',
		databaseID: '',
		tagButton: true,
		customTitleButton: false,
		customTitleName: '',
		customProperties: [],
		// customValues: '',
		saved: false,
	};
	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab, dbDetails?: DatabaseDetails) {
		super(app);
		this.plugin = plugin;
		this.settingTab = settingTab;
		this.properties = [];
		if (dbDetails) {
			this.data.databaseFormat = dbDetails.format;
			this.data.databaseFullName = dbDetails.fullName;
			this.data.databaseAbbreviateName = dbDetails.abName;
			this.data.notionAPI = dbDetails.notionAPI;
			this.data.databaseID = dbDetails.databaseID;
			this.data.tagButton = dbDetails.tagButton;
			this.data.customTitleButton = dbDetails.customTitleButton;
			this.data.customTitleName = dbDetails.customTitleName;
			this.data.customProperties = dbDetails.customProperties;
			// this.data.customValues = dbDetails.customValues;
			this.data.saved = dbDetails.saved;
		}
	}

	display(): void {
		this.containerEl.addClass("settings-modal");
		this.titleEl.setText('Add new database');

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
					.setValue(this.data.databaseFormat)
					.onChange(async (value) => {
						this.data.databaseFormat = value;
						nextTabs.empty();
						this.updateContentBasedOnSelection(value, nextTabs);
					});

				// Initialize content based on the current dropdown value
				(this.data.saved) ? this.updateContentBasedOnSelection(this.data.databaseFormat, nextTabs) : this.updateContentBasedOnSelection(this.plugin.settings.databaseFormat, nextTabs);

			});


		// add save button
		let footerEl = contentEl.createDiv('save-button');
		let saveButton = new Setting(footerEl)
		saveButton.addButton((button: ButtonComponent) => {
			return button
				.setTooltip('Save')
				.setIcon('checkmark')
				.onClick(async () => {
					this.data.saved = true;
					this.data.customProperties = this.properties;
					this.close();
				});
		}
		);
		saveButton.addExtraButton((button) => {
			return button
				.setTooltip('Cancel')
				.setIcon('cross')
				.onClick(() => {
					this.data.saved = false;
					// this.data.customProperties = this.properties;
					this.close();
				});
		}
		);
	}

	updateContentBasedOnSelection(value: string, nextTabs: HTMLElement): void {
		// Clear existing content
		nextTabs.empty();

		// Generate content based on the selected value
		if (value === 'general') {
			nextTabs.createEl('h3', { text: i18nConfig.NotionGeneralSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.data.databaseFullName, 'data', 'databaseFullName')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.data.databaseAbbreviateName, 'data', 'databaseAbbreviateName')

			// tag button
			this.createSettingEl(nextTabs, i18nConfig.NotionTagButton, i18nConfig.NotionTagButtonDesc, 'toggle', i18nConfig.NotionCustomTitleText, this.data.tagButton, 'data', 'tagButton')

			// add custom title button

			new Setting(nextTabs)
				.setName(i18nConfig.NotionCustomTitle)
				.setDesc(i18nConfig.NotionCustomTitleDesc)
				.addToggle((toggle) =>
					toggle
						.setValue(this.data.customTitleButton)
						.onChange(async (value) => {
							this.data.customTitleButton = value;
							this.updateSettingEl(CustomNameEl, value)

						})
				);


			// add custom title name
			const CustomNameEl = this.createStyleDiv('custom-name', (this.data.customTitleButton), nextTabs);
			this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.data.customTitleName, 'data', 'customTitleName')


			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.data.notionAPI, 'data', 'notionAPI')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.data.databaseID, 'data', 'databaseID')


		} else if (value === 'next') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionNextSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.data.databaseFullName, 'data', 'databaseFullName')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.data.databaseAbbreviateName, 'data', 'databaseAbbreviateName')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.data.notionAPI, 'data', 'notionAPI')


			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.data.databaseID, 'data', 'databaseID')

		} else if (value === 'custom') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionCustomSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.data.databaseFullName, 'data', 'databaseFullName')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.data.databaseAbbreviateName, 'data', 'databaseAbbreviateName')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.data.notionAPI, 'data', 'notionAPI')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.data.databaseID, 'data', 'databaseID')

			// add new property button
			new Setting(nextTabs)
				.setName(i18nConfig.NotionCustomValues)
				.setDesc(i18nConfig.NotionCustomValuesDesc)
				.addButton((button: ButtonComponent) => {
					return button
						.setTooltip('Add one more property')
						.setButtonText('Add New Property')
						.onClick(async () => {
							const customTabs = nextTabs.createDiv("custom-tabs");
							this.createPropertyLine(customTabs, this.properties);
						});
				}
				);
		}
	}


	onOpen() {
		// add console log to check if the modal is opened
		this.display()
	}

	createPropertyLine(containerEl: HTMLElement, properties: customProperty[]): void {
		const propertyIndex = properties.length;

		properties.push({ customName: "", customType: "", index: propertyIndex });

		const propertyLine = new Setting(containerEl)
			.setName(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumn : `${i18nConfig.CustomProperty} ${propertyIndex}`)
			.setDesc(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumnDesc : "");

		propertyLine.addText(text => {
			text.setPlaceholder(i18nConfig.CustomPropertyName)
				.setValue("")
				.onChange(value => {
					let actualIndex = properties.findIndex(p => p.index === propertyIndex);
					if (actualIndex !== -1) {
						properties[actualIndex].customName = value;
					}
				});
		});


		propertyLine.addDropdown((dropdown) => {
			const options: Record<string, string> = {
				'rich_text': 'Text',
				'number': 'Number',
				'select': 'Select',
				'multi_select': 'Multi-Select',
				'date': 'Date',
				'files': 'Files & Media',
				'checkbox': 'Checkbox',
				'url': 'URL',
				'email': 'Email',
				'phone_number': 'Phone Number',
				// 'formula': 'Formula',
				// 'relation': 'Relation',
				// 'rollup': 'Rollup',
				// 'created_time': 'Created time',
				// 'created_by': 'Created by',
				// 'last_edited_time': 'Last Edited Time',
				// 'last_edited_by': 'Last Edited By',
			};

			const currentProperty = properties[propertyIndex];

			if (propertyIndex === 0) {
				dropdown.addOption("title", "Title");
			} else {
				Object.keys(options).forEach(key => {
					dropdown.addOption(key, options[key]);
				});
			}
			dropdown.setValue("")
				.onChange(value => {
					if (currentProperty) {
						currentProperty.customType = value;
						// Retrieve the index of currentProperty from the properties array
						const updatedIndex = properties.findIndex(p => p === currentProperty);
						console.log(`Updated value at index ${updatedIndex}: ${value}`);
					} else {
						console.log("Property not found, may have been deleted.");
					}
				});
		});


		if (propertyIndex > 0) {
			propertyLine.addButton(button => {
				return button
					.setTooltip("Delete")
					.setIcon("trash")
					.onClick(() => {
						this.deleteProperty(propertyIndex, properties);
					});
			});
		}

		this.propertyLines.push(propertyLine);
		this.updatePropertyLines(); // Ensure property lines are updated after creation
	}

	deleteProperty(propertyIndex: number, properties: customProperty[]): void {
		let actualIndex = properties.findIndex(p => p.index === propertyIndex);
		if (actualIndex !== -1) {
			properties.splice(actualIndex, 1);
			if (this.propertyLines[actualIndex]) {
				this.propertyLines[actualIndex].settingEl.remove();
				this.propertyLines.splice(actualIndex, 1);
			}
			// Update indices in the properties array
			properties.forEach((prop, idx) => {
				prop.index = idx;
			});

			this.updatePropertyLines();
		}
	}

	updatePropertyLines() {
		this.propertyLines.forEach((line, idx) => {
			line.setName(idx === 0 ? i18nConfig.CustomPropertyFirstColumn : `${i18nConfig.CustomProperty} ${idx}`);
		});
	}

	// create a function to create a div with a style for pop over elements
	public createStyleDiv(className: string, commandValue: boolean = false, parentEl: HTMLElement) {
		return parentEl.createDiv(className, (div) => {
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
	public createSettingEl(contentEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any, dataRecord: string, settingsKey: string) {
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
							this[dataRecord][settingsKey] = value; // Update the settings dictionary							await this.plugin.saveSettings();
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
							this[dataRecord][settingsKey] = value; // Update the settings dictionary							await this.plugin.saveSettings();
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
							this[dataRecord][settingsKey] = value; // Update the settings dictionary							await this.plugin.saveSettings();
						})
				);
		}
	}
}
