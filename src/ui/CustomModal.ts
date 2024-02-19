import {App, Modal, Setting} from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import {ObsidianSettingTab} from "./settingTabs";
import {i18nConfig} from "../lang/I18n";

export class CustomModal extends Modal {
	propertyLines: Setting[] = []; // Store all property line settings
	properties: { customName: string, customType: string }[] = []; // Array to store property values and types
	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;

	constructor(app: App) {
		super(app);
	}

	createPropertyLine(containerEl: HTMLElement): void {
		const propertyIndex = this.properties.length;
		this.properties.push({customName: "", customType: ""}); // Initialize with empty values

		const propertyLine = new Setting(containerEl)

		if (propertyIndex === 0) {
			propertyLine
				.setName(i18nConfig.CustomPropertyFirstColumn)
				.setDesc(i18nConfig.CustomPropertyFirstColumnDesc)

				propertyLine.addText((text) => {
					text
						.setPlaceholder("Property name")
						.setValue("")
						.onChange(async (value) => {
							this.properties[propertyIndex].customName = value; // Update the customValue of the specific property
						});

				}
			)

			propertyLine.addDropdown((dropdown) => {
					dropdown
						.addOption("title", "Title")
						.setValue("")
						.onChange(async (value) => {
							this.properties[propertyIndex].customType = value; // Update the customType of the specific property
						});
				}
		)
		} else {
			propertyLine
			.setName(i18nConfig.CustomProperty + (propertyIndex))

		propertyLine.addText((text) => {
				text
					.setPlaceholder(i18nConfig.CustomPropertyName)
					.setValue("")
					.onChange(async (value) => {
						this.properties[propertyIndex].customName = value; // Update the customValue of the specific property
					});
			}
		)

		propertyLine.addDropdown((dropdown) => {
				dropdown
					// .addOption("none", '')
					.addOption("text", "Text")
					.addOption("number", "Number")
					.addOption("select", "Select")
					.addOption("multi_select", "Multi-Select")
					.addOption("date", "Date")
					// .addOption("person", "Person")
					.addOption("file", "Files & Media")
					.addOption("checkbox", "Checkbox")
					.addOption("url", "URL")
					.addOption("email", "Email")
					.addOption("phone_number", "Phone Number")
					// .addOption("formula", "Formula")
					// .addOption("relation", "Relation")
					// .addOption("rollup", "Rollup")
					// .addOption("created_time", "Created time")
					// .addOption("created_by", "Created by")
					// .addOption("last_edited_time", "Last Edited Time")
					// .addOption("last_edited_by", "Last Edited By")
					.setValue("")
					.onChange(async (value) => {
						this.properties[propertyIndex].customType = value; // Update the customType of the specific property
					});
			}
		)

		propertyLine.addButton((button) => {
				return button
					.setTooltip("Delete")
					.setIcon("trash")
					.onClick(async () => {
						// Handle the deletion of this property line
						this.propertyLines = this.propertyLines.filter(line => line !== propertyLine);
						this.properties.splice(propertyIndex, 1); // Remove the property from the array
						propertyLine.settingEl.remove();
					});
			}
		);
		}
		this.propertyLines.push(propertyLine);
	}


	display(): void {

		this.containerEl.addClass("custom-modal");
		this.titleEl.setText(i18nConfig.AddCustomProperty);

		let {contentEl} = this;
		contentEl.empty();

		const customDiv = contentEl.createDiv("custom-div");

		new Setting(customDiv)
			.setName(i18nConfig.AddNewProperty)
			.setDesc(i18nConfig.AddNewPropertyDesc)
			.addButton((button) => {
				return button
					.setTooltip("Add")
					.setIcon("plus")
					.onClick(async () => {
						const customTabs = customDiv.createDiv("custom-tabs");
						this.createPropertyLine(customTabs);
					});
			});


		let footerEl = this.contentEl.createDiv("save-custom-value");
		let saveButton = new Setting(footerEl)
		saveButton.addButton((button) => {
				return button
					.setTooltip("Save")
					.setIcon("checkmark")
					.onClick(async () => {
						this.close();
					});
			}
		);

		saveButton.addExtraButton((button) => {
				return button
					.setTooltip("Cancel")
					.setIcon("cross")
					.onClick(async () => {
						this.close();
					});
			}
		);
	}

	onOpen(): void {
		this.display();
	}

	onClose(): void {
		const {contentEl} = this;

		contentEl.empty();
	}
}
