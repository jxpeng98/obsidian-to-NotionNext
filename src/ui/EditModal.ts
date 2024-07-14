import { App, ButtonComponent, Setting } from "obsidian";
import { customProperty, SettingModal } from "./settingModal";
import ObsidianSyncNotionPlugin from "../main";
import { DatabaseDetails, ObsidianSettingTab } from "./settingTabs";
import { i18nConfig } from "../lang/I18n";

export class EditModal extends SettingModal {
	propertyLines: Setting[] = []; // Store all property line settings
	[key: string]: any; // Index signature
	dataTemp: Record<string, any> = {
		databaseFormatTemp: '',
		// databaseFormatTempInd: false,
		databaseFullNameTemp: '',
		// databaseFullNameTempInd: false,
		databaseAbbreviateNameTemp: '',
		// databaseAbbreviateNameTempInd: false,
		notionAPITemp: '',
		// notionAPITempInd: false,
		databaseIDTemp: '',
		// databaseIDTempInd: false,
		tagButtonTemp: false,
		// tagButtonTempInd: false,
		customTitleButtonTemp: false,
		// customTitleButtonTempInd: false,
		customTitleNameTemp: '',
		customPropertiesTemp: [],
		// customTitleNameTempInd: false,
		// customValues: '',
		savedTemp: false,
		savedTempInd: false,
	};
	dataPrev: Record<string, any> = {
		databaseFormatPrev: '',
		// databaseFormatPrevInd: false,
		databaseFullNamePrev: '',
		// databaseFullNamePrevInd: false,
		databaseAbbreviateNamePrev: '',
		// databaseAbbreviateNamePrevInd: false,
		notionAPIPrev: '',
		// notionAPIPrevInd: false,
		databaseIDPrev: '',
		// databaseIDPrevInd: false,
		tagButtonPrev: false,
		// tagButtonPrevInd: false,
		customTitleButtonPrev: false,
		// customTitleButtonPrevInd: false,
		customTitleNamePrev: '',
		customPropertiesPrev: [],
		// customTitleNamePrevInd: false,
		// customValues: '',
		savedPrev: false,
		savedPrevInd: false,
	};


	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;
	dbDetails: DatabaseDetails;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab, dbDetails: DatabaseDetails) {
		super(app, plugin, settingTab);
		this.plugin = plugin;
		this.settingTab = settingTab;
		if (dbDetails) {
			// Temp details
			this.dataTemp.databaseFormatTemp = dbDetails.format;
			this.dataTemp.databaseFullNameTemp = dbDetails.fullName;
			this.dataTemp.databaseAbbreviateNameTemp = dbDetails.abName;
			this.dataTemp.notionAPITemp = dbDetails.notionAPI;
			this.dataTemp.databaseIDTemp = dbDetails.databaseID;
			this.dataTemp.tagButtonTemp = dbDetails.tagButton;
			this.dataTemp.customTitleButtonTemp = dbDetails.customTitleButton;
			this.dataTemp.customTitleNameTemp = dbDetails.customTitleName;
			this.dataTemp.customPropertiesTemp = dbDetails.customProperties.map(prop => ({ ...prop })); // Ensure deep copy
			// this.dataTemp.customValues = dbDetails.customValues;
			this.dataTemp.savedTemp = dbDetails.saved;

			// Prev details
			this.dataPrev.databaseFormatPrev = dbDetails.format;
			this.dataPrev.databaseFullNamePrev = dbDetails.fullName;
			this.dataPrev.databaseAbbreviateNamePrev = dbDetails.abName;
			this.dataPrev.notionAPIPrev = dbDetails.notionAPI;
			this.dataPrev.databaseIDPrev = dbDetails.databaseID;
			this.dataPrev.tagButtonPrev = dbDetails.tagButton;
			this.dataPrev.customTitleButtonPrev = dbDetails.customTitleButton;
			this.dataPrev.customTitleNamePrev = dbDetails.customTitleName;
			this.dataPrev.customPropertiesPrev = dbDetails.customProperties.map(prop => ({ ...prop })); // Ensure deep copy
			// this.dataTemp.customValues = dbDetails.customValues;
			this.dataPrev.savedPrev = dbDetails.saved;
		}
	}


	display(): void {
		this.containerEl.addClass("edit-modal");
		this.titleEl.setText('Edit Database');

		let { contentEl } = this;
		contentEl.empty();

		const editDiv = contentEl.createDiv('edit-div');
		const nextTabs = contentEl.createDiv('next-tabs');


		new Setting(editDiv)
			.setName(i18nConfig.databaseFormat)
			.setDesc(i18nConfig.databaseFormatDesc)
			.addDropdown((component) => {
				component
					.addOption('none', '')
					.addOption('general', i18nConfig.databaseGeneral)
					.addOption('next', i18nConfig.databaseNext)
					.addOption('custom', i18nConfig.databaseCustom)
					.setValue(this.dataTemp.databaseFormatTemp)
					.onChange(async (value) => {
						this.dataTemp.databaseFormatTemp = value;
						nextTabs.empty();
						this.updateContentBasedOnSelection(value, nextTabs);
					});

				// Initialize content based on the current dropdown value
				this.updateContentBasedOnSelection(this.dataTemp.databaseFormatTemp, nextTabs);
			});


		// add save button
		let footerEl = contentEl.createDiv('save-button');
		let saveButton = new Setting(footerEl)
		saveButton.addButton((button: ButtonComponent) => {
			return button
				.setTooltip('Save')
				.setIcon('checkmark')
				.onClick(async () => {
					this.dataTemp.savedTempInd = true;
					this.dataTemp.savedTemp = true;
					// console.log(this.dataTemp);
					// console.log(this.dataPrev);
					this.close();
				});
		}
		);
		saveButton.addExtraButton((button) => {
			return button
				.setTooltip('Cancel')
				.setIcon('cross')
				.onClick(() => {
					// console.log(this.dataTemp);
					// console.log(this.dataPrev);
					this.close();
				});
		}
		);
	}

	onOpen(): void {
		this.display()
	}

	updateContentBasedOnSelection(value: string, nextTabs: HTMLElement): void {
		// Clear existing content
		nextTabs.empty();

		// Generate content based on the selected value
		if (value === 'general') {
			nextTabs.createEl('h3', { text: i18nConfig.NotionGeneralSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp', 'databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp', 'databaseAbbreviateNameTemp')

			// tag button
			this.createSettingEl(nextTabs, i18nConfig.NotionTagButton, i18nConfig.NotionTagButtonDesc, 'toggle', i18nConfig.NotionCustomTitleText, this.dataTemp.tagButtonTemp, 'dataTemp', 'tagButtonTemp')

			// add custom title button

			new Setting(nextTabs)
				.setName(i18nConfig.NotionCustomTitle)
				.setDesc(i18nConfig.NotionCustomTitleDesc)
				.addToggle((toggle) =>
					toggle
						.setValue(this.dataTemp.customTitleButtonTemp)
						.onChange(async (value) => {
							this.dataTemp.customTitleButtonTemp = value;
							this.updateSettingEl(CustomNameEl, value)

						})
				);


			// add custom title name
			const CustomNameEl = this.createStyleDiv('custom-name', (this.dataTemp.customTitleButtonTemp), nextTabs);
			this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.dataTemp.customTitleNameTemp, 'dataTemp', 'customTitleNameTemp')


			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp', 'notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp', 'databaseIDTemp')


		} else if (value === 'next') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionNextSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp', 'databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp', 'databaseAbbreviateNameTemp')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp', 'notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp', 'databaseIDTemp')

		} else if (value === 'custom') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionCustomSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp', 'databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp', 'databaseAbbreviateNameTemp')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp', 'notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp', 'databaseIDTemp')

			// add custom properties
			this.initializePropertyLines(nextTabs, this.dataTemp.customPropertiesTemp);
		}
	}

	initializePropertyLines(containerEl: HTMLElement, properties: customProperty[]): void {
		if (!containerEl) {
			console.error('Failed to initialize property lines: containerEl is null');
			return;
		}

		new Setting(containerEl)
			.setName("Add New Property")
			.setDesc("Click to add a new property")
			.addButton(button => {
				return button
					.setButtonText('Add')
					.setTooltip('Add one more property')
					.onClick(() => {
						this.createPropertyLine(containerEl, properties);
					});
			});

		properties.forEach(property => {
			this.updatePropertyLine(containerEl, property, properties);
		});
	}


	updatePropertyLine(containerEl: HTMLElement, property: customProperty, properties: customProperty[]) {
		let isExistingProperty = property !== null;
		const propertyIndex = isExistingProperty ? property.index : properties.length;

		const propertyLine = new Setting(containerEl)
			.setName(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumn : `${i18nConfig.CustomProperty} ${propertyIndex}`)
			.setDesc(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumnDesc : "");

		propertyLine.addText(text => {
			text.setPlaceholder(i18nConfig.CustomPropertyName)
				.setValue(isExistingProperty ? property.customName : "")
				.onChange(value => {
					const actualIndex = properties.findIndex(p => p.index === propertyIndex);
					if (actualIndex !== -1) {
						properties[actualIndex].customName = value;
					} else {
						properties.push({ customName: value, customType: '', index: propertyIndex });
						isExistingProperty = true;
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
				'phone_number': 'Phone Number'
			};

			if (propertyIndex === 0) {
				dropdown.addOption('title', 'Title');
			} else {
				Object.keys(options).forEach(key => {
					dropdown.addOption(key, options[key]);
				});
			}

			dropdown.setValue(isExistingProperty ? property.customType : "")
				.onChange(value => {
					const actualIndex = properties.findIndex(p => p.index === propertyIndex);
					if (actualIndex !== -1) {
						properties[actualIndex].customType = value;
					} else if (!isExistingProperty) {
						properties.push({ customName: '', customType: value, index: propertyIndex });
						isExistingProperty = true; // Update the flag to prevent re-adding
					}
				});
		});

		if (propertyIndex > 0) {
			propertyLine.addButton(button => {
				return button
					.setTooltip("Delete")
					.setIcon("trash")
					.onClick(() => {
						console.log('Deleting property', properties[propertyIndex]);
						this.deleteProperty(propertyIndex, properties);
					});
			});
		}

		this.propertyLines.push(propertyLine);
		this.updatePropertyLines();

	}

	createStyleDiv(className: string, commandValue: boolean = false, parentEl: HTMLElement): HTMLDivElement {
		return super.createStyleDiv(className, commandValue, parentEl);
	}

	updateSettingEl(element: HTMLElement, commandValue: boolean) {
		super.updateSettingEl(element, commandValue);
	}

	createSettingEl(contentEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any, dataRecord: string, settingsKey: string): Setting {
		return super.createSettingEl(contentEl, name, desc, type, placeholder, holderValue, dataRecord, settingsKey);
	}
}
