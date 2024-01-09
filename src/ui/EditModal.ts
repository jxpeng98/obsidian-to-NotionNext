import {App, ButtonComponent, Modal, Setting} from "obsidian";
import {SettingModal} from "./settingModal";
import ObsidianSyncNotionPlugin from "../main";
import {DatabaseDetails, ObsidianSettingTab} from "./settingTabs";
import {i18nConfig} from "../lang/I18n";

export class EditModal extends SettingModal {
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
			// this.dataTemp.customValues = dbDetails.customValues;
			this.dataPrev.savedPrev = dbDetails.saved;
		}
	}


	display(): void {
		this.containerEl.addClass("edit-modal");
		this.titleEl.setText('Edit Database');

		let {contentEl} = this;
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
						// .addOption('custom', i18nConfig.databaseCustom)
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
						.setValue(this.dataTemp.CustomTitleButtonTemp)
						.onChange(async (value) => {
							this.dataTemp.CustomTitleButtonTemp = value;

							this.updateSettingEl(CustomNameEl, value)

							// this.updateSettingEl(CustomValuesEl, value)

							// await this.plugin.saveSettings();
							// await this.plugin.commands.updateCommand();
						})
				);


			// add custom title name
			const CustomNameEl = this.createStyleDiv('custom-name', (this.dataTemp.CustomTitleButtonTemp), nextTabs);
			this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.dataTemp.CustomTitleNameTemp,'dataTemp', 'CustomTitleNameTemp')


			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp','notionAPITemp')

			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp','databaseIDTemp')


		} else if (value === 'next') {

			nextTabs.createEl('h3', { text: i18nConfig.NotionNextSettingHeader });

			// add full name
			this.createSettingEl(nextTabs, i18nConfig.databaseFullName, i18nConfig.databaseFullNameDesc, 'text', i18nConfig.databaseFullNameText, this.dataTemp.databaseFullNameTemp, 'dataTemp','databaseFullNameTemp')

			// add abbreviate name
			this.createSettingEl(nextTabs, i18nConfig.databaseAbbreviateName, i18nConfig.databaseAbbreviateNameDesc, 'text', i18nConfig.databaseAbbreviateNameText, this.dataTemp.databaseAbbreviateNameTemp, 'dataTemp','databaseAbbreviateNameTemp')

			// add api key
			this.createSettingEl(nextTabs, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp','notionAPITemp')


			// add database id
			this.createSettingEl(nextTabs, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp','databaseIDTemp')

		} else if (value === 'custom') {
			nextTabs.createEl('h3', { text: i18nConfig.NotionCustomSettingHeader});

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
						.setValue(this.dataTemp.CustomTitleButtonTemp)
						.onChange(async (value) => {
							this.dataTemp.CustomTitleButtonTemp = value;

							this.updateSettingEl(CustomNameEl, value)

							// this.updateSettingEl(CustomValuesEl, value)

							// await this.plugin.saveSettings();
							// await this.plugin.commands.updateCommand();
						})
				);


			// add custom title name
			const CustomNameEl = this.createStyleDiv('custom-name', (this.dataTemp.CustomTitleButtonTemp), nextTabs);
			this.createSettingEl(CustomNameEl, i18nConfig.NotionCustomTitleName, i18nConfig.NotionCustomTitleNameDesc, 'text', i18nConfig.NotionCustomTitleText, this.dataTemp.CustomTitleNameTemp,'dataTemp', 'CustomTitleNameTemp')

			// // add custom values
			// const CustomValuesEl = this.createStyleDiv('custom-values', (this.dataTemp.CustomTitleButton), nextTabs);
			// new Setting(CustomValuesEl)
			// 	.setName(i18nConfig.NotionCustomValues)
			// 	.setDesc(i18nConfig.NotionCustomValuesDesc)
			// 	.addTextArea((text) => {
			// 		return text
			// 			.setPlaceholder(i18nConfig.NotionCustomValuesText)
			// 			.setValue(this.dataTemp.CustomValues)
			// 			.onChange(async (value) => {
			// 				this.dataTemp.CustomValues = value;
			// 				await this.plugin.saveSettings();
			// 			});
			// 	});


			// add api key
			const notionAPIGeneralEl = this.createStyleDiv('api-general', this.plugin.settings.GeneralButton, nextTabs);
			this.createSettingEl(notionAPIGeneralEl, i18nConfig.NotionAPI, i18nConfig.NotionAPIDesc, 'password', i18nConfig.NotionAPIText, this.dataTemp.notionAPITemp, 'dataTemp','notionAPITemp')

			// add database id
			const databaseIDGeneralEl = this.createStyleDiv('databaseID-general', this.plugin.settings.GeneralButton, nextTabs);
			this.createSettingEl(databaseIDGeneralEl, i18nConfig.DatabaseID, i18nConfig.NotionAPIDesc, 'password', i18nConfig.DatabaseIDText, this.dataTemp.databaseIDTemp, 'dataTemp', 'databaseIDTemp')
		}

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
