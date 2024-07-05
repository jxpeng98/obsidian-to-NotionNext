import { App, ButtonComponent, PluginSettingTab, Setting } from "obsidian";
import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";
import { SettingModal } from "./settingModal";
import { PreviewModal } from "./PreviewModal";
import { EditModal } from "./EditModal";
import { DeleteModal } from "./DeleteModal";

export interface PluginSettings {
	NextButton: boolean;
	notionAPINext: string;
	databaseIDNext: string;
	bannerUrl: string;
	notionUser: string;
	NotionLinkDisplay: boolean;
	proxy: string;
	GeneralButton: boolean;
	tagButton: boolean;
	customTitleButton: boolean;
	customTitleName: string;
	notionAPIGeneral: string;
	databaseIDGeneral: string;
	CustomButton: boolean;
	CustomValues: string;
	notionAPICustom: string;
	databaseIDCustom: string;
	[key: string]: any;
	databaseDetails: Record<string, DatabaseDetails>
}

export interface DatabaseDetails {
	format: string;
	fullName: string;
	abName: string;
	notionAPI: string;
	databaseID: string;
	tagButton: boolean;
	customTitleButton: boolean;
	customTitleName: string;
	customProperties: { customName: string, customType: string, index: number }[];
	// customValues: string;
	saved: boolean;
}

export const DEFAULT_SETTINGS: PluginSettings = {
	NextButton: true,
	notionAPINext: "",
	databaseIDNext: "",
	bannerUrl: "",
	notionUser: "",
	NotionLinkDisplay: true,
	proxy: "",
	GeneralButton: true,
	tagButton: true,
	customTitleButton: false,
	customTitleName: "",
	notionAPIGeneral: "",
	databaseIDGeneral: "",
	CustomButton: false,
	CustomValues: "",
	notionAPICustom: "",
	databaseIDCustom: "",
	databaseDetails: {},
};


export class ObsidianSettingTab extends PluginSettingTab {
	plugin: ObsidianSyncNotionPlugin;
	databaseEl: HTMLDivElement;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		// General Settings
		containerEl.createEl('h2', { text: i18nConfig.GeneralSetting });

		this.createSettingEl(containerEl, i18nConfig.BannerUrl, i18nConfig.BannerUrlDesc, 'text', i18nConfig.BannerUrlText, this.plugin.settings.bannerUrl, 'bannerUrl')

		this.createSettingEl(containerEl, i18nConfig.NotionUser, i18nConfig.NotionUserDesc, 'text', i18nConfig.NotionUserText, this.plugin.settings.notionUser, 'notionUser')

		this.createSettingEl(containerEl, i18nConfig.NotionLinkDisplay, i18nConfig.NotionLinkDisplayDesc, 'toggle', i18nConfig.NotionLinkDisplay, this.plugin.settings.NotionLinkDisplay, 'NotionLinkDisplay')


		// add new button
		new Setting(containerEl)
			.setName("Add New Database")
			.setDesc("Add New Database")
			.addButton((button: ButtonComponent): ButtonComponent => {
				return button
					.setTooltip("Add New Database")
					.setIcon("plus")
					.onClick(async () => {
						let modal = new SettingModal(this.app, this.plugin, this);

						modal.onClose = () => {
							if (modal.data.saved) {
								const dbDetails = {
									format: modal.data.databaseFormat,
									fullName: modal.data.databaseFullName,
									abName: modal.data.databaseAbbreviateName,
									notionAPI: modal.data.notionAPI,
									databaseID: modal.data.databaseID,
									tagButton: modal.data.tagButton,
									customTitleButton: modal.data.customTitleButton,
									customTitleName: modal.data.customTitleName,
									customProperties: modal.data.customProperties,
									// customValues: modal.data.customValues,
									saved: modal.data.saved,
								}

								this.plugin.addDatabaseDetails(dbDetails);

								this.plugin.commands.updateCommand();

								this.display()
							}
						}

						modal.open();
					});
			});

		// new section to display all created database
		containerEl.createEl('h2', { text: "Database List" });

		this.databaseEl = containerEl.createDiv('database-list');
		// list all created database
		this.showDatabase();

	}

	// create a function to create a div with a style for pop over elements
	// public createStyleDiv(className: string, commandValue: boolean = false) {
	//     return this.containerEl.createDiv(className, (div) => {
	//         this.updateSettingEl(div, commandValue);
	//     });
	// }

	// update the setting display style in the setting tab
	public updateSettingEl(element: HTMLElement, commandValue: boolean) {
		element.style.borderTop = commandValue ? "1px solid var(--background-modifier-border)" : "none";
		element.style.paddingTop = commandValue ? "0.75em" : "0";
		element.style.display = commandValue ? "block" : "none";
		element.style.alignItems = "center";
	}

	// function to add one setting element in the setting tab.
	public createSettingEl(containerEl: HTMLElement, name: string, desc: string, type: string, placeholder: string, holderValue: any, settingsKey: string) {
		if (type === 'password') {
			return new Setting(containerEl)
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
			return new Setting(containerEl)
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
			return new Setting(containerEl)
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

	// function to show all the database details
	showDatabase() {
		this.databaseEl.empty();

		for (let key in this.plugin.settings.databaseDetails) {
			let dbDetails = this.plugin.settings.databaseDetails[key];

			const databaseDiv = this.databaseEl.createDiv('database-div');

			let settingEl = new Setting(databaseDiv)
				.setName(`${dbDetails.fullName} (${dbDetails.abName})`)
				.setDesc(dbDetails.format)


			// add a button for preview data
			settingEl
				.addButton((button: ButtonComponent): ButtonComponent => {
					return button
						.setTooltip("Preview Database")
						.setIcon("eye")
						.onClick(async () => {
							let modal = new PreviewModal(this.app, this.plugin, this, dbDetails);

							modal.open();
						});
				});

			// add a button for edit data
			settingEl
				.addButton((button: ButtonComponent): ButtonComponent => {
					return button
						.setTooltip("Edit Database")
						.setIcon("pencil")
						.onClick(async () => {
							let modal = new EditModal(this.app, this.plugin, this, dbDetails);

							modal.onClose = () => {
								if (modal.dataTemp.savedTempInd) {
									const dbDetailsNew: DatabaseDetails = {
										format: modal.dataTemp.databaseFormatTemp,
										fullName: modal.dataTemp.databaseFullNameTemp,
										abName: modal.dataTemp.databaseAbbreviateNameTemp,
										notionAPI: modal.dataTemp.notionAPITemp,
										databaseID: modal.dataTemp.databaseIDTemp,
										tagButton: modal.dataTemp.tagButtonTemp,
										customTitleButton: modal.dataTemp.customTitleButtonTemp,
										customTitleName: modal.dataTemp.customTitleNameTemp,
										customProperties: modal.dataTemp.customPropertiesTemp,
										// customValues: modal.data.customValues,
										saved: modal.dataTemp.savedTemp,
									}

									const dbDetailsPrev: DatabaseDetails = {
										format: modal.dataPrev.databaseFormatPrev,
										fullName: modal.dataPrev.databaseFullNamePrev,
										abName: modal.dataPrev.databaseAbbreviateNamePrev,
										notionAPI: modal.dataPrev.notionAPIPrev,
										databaseID: modal.dataPrev.databaseIDPrev,
										tagButton: modal.dataPrev.tagButtonPrev,
										customTitleButton: modal.dataPrev.customTitleButtonPrev,
										customTitleName: modal.dataPrev.customTitleNamePrev,
										customProperties: modal.dataPrev.customPropertiesPrev,
										// customValues: modal.data.customValues,
										saved: modal.dataPrev.savedPrev,
									}

									this.plugin.deleteDatabaseDetails(dbDetailsPrev);
									this.plugin.updateDatabaseDetails(dbDetailsNew);

									this.plugin.commands.updateCommand();

									this.display()
								}
							}

							modal.open();
						});
				});

			settingEl
				.addButton((button: ButtonComponent): ButtonComponent => {
					return button
						.setTooltip("Delete Database")
						.setIcon("trash")
						.onClick(async () => {
							let modal = new DeleteModal(this.app, this.plugin, this, dbDetails);

							modal.onClose = () => {
								if (modal.data.deleted) {
									this.plugin.deleteDatabaseDetails(dbDetails);

									console.log(dbDetails.fullName + " deleted");

									this.plugin.commands.updateCommand();

									this.display()
								}
							}

							modal.open();

						});
				});
		}
	}
}


