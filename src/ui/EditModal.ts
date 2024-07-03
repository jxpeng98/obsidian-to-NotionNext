import {App, ButtonComponent, Modal, Setting} from "obsidian";
import {customProperty, SettingModal} from "./settingModal";
import ObsidianSyncNotionPlugin from "../main";
import {DatabaseDetails, ObsidianSettingTab} from "./settingTabs";
import {i18nConfig} from "../lang/I18n";

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
			this.dataTemp.customPropertiesTemp = dbDetails.customProperties;
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
			this.dataPrev.customPropertiesPrev = dbDetails.customProperties;
			// this.dataTemp.customValues = dbDetails.customValues;
			this.dataPrev.savedPrev = dbDetails.saved;
		}
	}


	display(): void {
		this.containerEl.addClass("edit-modal");
		this.titleEl.setText('Edit Database');

		let {contentEl} = this;
		contentEl.empty();

		let properties: { customName: string, customType: string , index: number} = this.dataTemp.customPropertiesTemp;

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
						this.close();
					});
			}
		);
		saveButton.addExtraButton((button) => {
				return button
					.setTooltip('Cancel')
					.setIcon('cross')
					.onClick(() => {
						this.dataTemp.savedTempInd = false;
						// reset the properties
						const properties: any[] = [];
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
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp,'dataTemp', 'databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp','databaseAbbreviateNameTemp')

			// tag button
			this.createSettingEl(nextTabs, i18nConfig.NotionTagButton, i18nConfig.NotionTagButtonDesc, 'toggle', i18nConfig.NotionCustomTitleText, this.dataTemp.tagButtonTemp, 'dataTemp','tagButtonTemp')

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
			this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.dataTemp.customTitleNameTemp,'dataTemp', 'customTitleNameTemp')


			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp','notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp','databaseIDTemp')


		} else if (value === 'next') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionNextSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp','databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp','databaseAbbreviateNameTemp')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp','notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp','databaseIDTemp')

		} else if (value === 'custom') {

			nextTabs.createEl('h3', {text: i18nConfig.NotionCustomSettingHeader});

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp', 'databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp', 'databaseAbbreviateNameTemp')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp', 'notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.DatabaseIDDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp', 'databaseIDTemp')

			// add new property button
			const properties = this.dataTemp.customPropertiesTemp;
			const propertiesContainer = nextTabs.createDiv("properties-container");

			new Setting(nextTabs)
				.setName(i18nConfig.NotionCustomValues)
				.setDesc(i18nConfig.NotionCustomValuesDesc)
				.addButton((button: ButtonComponent) => {
						return button
							.setTooltip('Add new property')
							.setIcon('plus')
							.onClick(async () => {
								this.createPropertyLine(propertiesContainer, properties);
							});
					}
				);

			this.initializePropertyLines(propertiesContainer, properties)
		}
	}

	initializePropertyLines(containerEl: HTMLElement, properties: customProperty[]): void {

		console.log(properties.length, "properties have been created");

		containerEl.innerHTML = '';

		// Retrieve and display existing properties
		properties.forEach(property => {
			createOrUpdatePropertyLine(containerEl, property);
		});

		// Add a button for creating new properties at the end of the container
		const addButton = document.createElement('button');
		addButton.textContent = "Add New Property";
		addButton.onclick = () => {
			createOrUpdatePropertyLine(containerEl, null, properties);
		};

		containerEl.appendChild(addButton);
	}

	createOrUpdatePropertyLine(containerEl: HTMLElement, property: null, properties: customProperty[]) {
		const isExistingProperty = property !== null;
		const propertyIndex = isExistingProperty ? property.index : properties.length;

		const propertyLine = new Setting(containerEl)
			.setName(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumn : `${i18nConfig.CustomProperty} ${propertyIndex}`)
			.setDesc(propertyIndex === 0 ? i18nConfig.CustomPropertyFirstColumnDesc : "");

		propertyLine.addText(text => {
			text.setPlaceholder(i18nConfig.CustomPropertyName)
				.setValue(isExistingProperty ? property.customName : "")
				.onChange(value => {
					let actualIndex = properties.findIndex(p => p.index === propertyIndex);
					if (actualIndex !== -1) {
						properties[actualIndex].customName = value;
					}
				});
		});

		propertyLine.addDropdown((dropdown) => {
			const options = {
				'text': 'Text',
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
			Object.keys(options).forEach(key => {
				dropdown.addOption(key, options[key]);
			});
			dropdown.setValue(isExistingProperty ? property.customType : "")
				.onChange(value => {
					if (isExistingProperty) {
						property.customType = value;
					} else {
						const newProperty = { customName: '', customType: value, index: propertyIndex };
						properties.push(newProperty);
					}
				});
		});

		if (isExistingProperty && propertyIndex > 0) {
			propertyLine.addButton(button => {
				return button
					.setTooltip("Delete")
					.setIcon("trash")
					.onClick(() => {
						deleteProperty(propertyIndex, properties);
					});
			});
		}

		if (!isExistingProperty) {
			properties.push({ customName: "", customType: "", index: propertyIndex });
		}

	}

		

	deleteProperty(index: number, properties: customProperty[]): void {
		const updatedProperties = properties.filter(p => p.index !== index);
		properties.length = 0; // Clear existing array
		updatedProperties.forEach(p => properties.push(p)); // Re-add filtered properties
		initializePropertyLines(document.getElementById('propertiesContainer'), properties); // Reinitialize UI
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
