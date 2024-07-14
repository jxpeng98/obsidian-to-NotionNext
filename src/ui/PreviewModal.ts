import { App, ExtraButtonComponent, Modal, Notice, Setting } from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import { DatabaseDetails, ObsidianSettingTab } from "./settingTabs";
import { customProperty } from "./settingModal";
import { i18nConfig } from "../lang/I18n";

export class PreviewModal extends Modal {
	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;
	dbDetails: DatabaseDetails;

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab, dbDetails: DatabaseDetails) {
		super(app);
		this.plugin = plugin;
		this.settingTab = settingTab;
		this.dbDetails = dbDetails;
	}


	display(): void {
		this.containerEl.addClass('preview-modal')
		this.titleEl.setText('Preview')

		let { contentEl } = this;

		const previewEl = contentEl.createDiv('preview-content')

		const dbFormatEl = new Setting(previewEl)
		dbFormatEl
			.setName('Database Format')
			.addText(text => text
				.setValue(this.dbDetails.format)
				.setDisabled(true));

		const dbFullEl = new Setting(previewEl)
		dbFullEl
			.setName('Database Full Name')
			.addText(text => text
				.setValue(this.dbDetails.fullName)
				.setDisabled(true));

		const dbAbbrEl = new Setting(previewEl)
		dbAbbrEl
			.setName('Database Abbreviate Name')
			.addText(text => text
				.setValue(this.dbDetails.abName)
				.setDisabled(true));
		// .controlEl.createEl('p', { text: this.dbDetails.abName })

		// Setting for toggle and copy buttons
		new Setting(previewEl)
			.setName('Notion API Key')
			.addExtraButton((button: ExtraButtonComponent) => {
				let isApiKeyVisible = false;

				return button
					.setTooltip('Toggle API Key Visibility')
					.setIcon('eye')
					.onClick(() => {
						isApiKeyVisible = !isApiKeyVisible;
						button.setIcon(isApiKeyVisible ? 'eye-off' : 'eye');
						apiKeySetting.settingEl.style.display = isApiKeyVisible ? '' : 'none'; // Toggle visibility
					});
			})


		// Setting for displaying the API key
		const apiKeySetting = new Setting(previewEl)

		apiKeySetting.infoEl.createEl('p', { text: this.dbDetails.notionAPI })


		apiKeySetting
			.addExtraButton((button: ExtraButtonComponent) => {
				return button
					.setTooltip('Copy API Key')
					.setIcon('clipboard')
					.onClick(() => {
						navigator.clipboard.writeText(this.dbDetails.notionAPI)
						new Notice('API Key copied to clipboard');
					});
			});

		apiKeySetting.settingEl.style.display = 'none'; // Hide initially



		new Setting(previewEl)
			.setName('Database ID')
			.addExtraButton((button: ExtraButtonComponent) => {
				let isDbIdVisible = false;

				return button
					.setTooltip('Toggle Database ID Visibility')
					.setIcon('eye')
					.onClick(() => {

						isDbIdVisible = !isDbIdVisible;
						button.setIcon(isDbIdVisible ? 'eye-off' : 'eye');
						dbIdSetting.settingEl.style.display = isDbIdVisible ? '' : 'none'; // Toggle visibility
					});
			})

		const dbIdSetting = new Setting(previewEl)

		dbIdSetting.infoEl.createEl('p', { text: this.dbDetails.databaseID })

		dbIdSetting
			.addExtraButton((button: ExtraButtonComponent) => {
				return button
					.setTooltip('Copy Database ID')
					.setIcon('clipboard')
					.onClick(() => {
						navigator.clipboard.writeText(this.dbDetails.databaseID)
						new Notice('Database ID copied to clipboard');
					});
			});

		dbIdSetting.settingEl.style.display = 'none'; // Hide initially

		// Preview the custom properties

		if (this.dbDetails.format === 'custom') {

			const customPrv = previewEl.createDiv("custom-tabs");

			this.previewPropertyLine(previewEl, this.dbDetails.customProperties);
		}

	}


	onOpen() {
		this.display()
	}


	previewPropertyLine(containerEl: HTMLElement, properties: customProperty[]): void {

		properties.forEach((property, index) => {
			const propertyLine = new Setting(containerEl)
				.setName(index === 0 ? i18nConfig.CustomPropertyFirstColumn : `${i18nConfig.CustomProperty} ${index}`)
				.setDesc(index === 0 ? i18nConfig.CustomPropertyFirstColumnDesc : "");

			propertyLine.addText(text => {
				text.setPlaceholder(i18nConfig.CustomPropertyName)
					.setValue(property.customName)
					.setDisabled(true);
			});

			propertyLine.addDropdown((dropdown) => {
				const options: Record<string, string> = {
					'title': 'Title',
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
					// Additional options can be added here
				};

				// Populate dropdown with options
				Object.keys(options).forEach(key => {
					dropdown.addOption(key, options[key]);
				});

				dropdown.setValue(property.customType)
					.setDisabled(true); // Disable dropdown to prevent changes
			});
		});
	}

}
