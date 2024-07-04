import { App, ButtonComponent, Modal, Setting } from "obsidian";
import { DatabaseDetails, ObsidianSettingTab } from "./settingTabs";
import ObsidianSyncNotionPlugin from "../main";

export class DeleteModal extends Modal {
	data: Record<string, any> = {
		deleted: false,
	}
	plugin: ObsidianSyncNotionPlugin;
	settingTab: ObsidianSettingTab;
	dbDetails: DatabaseDetails

	constructor(app: App, plugin: ObsidianSyncNotionPlugin, settingTab: ObsidianSettingTab, dbDetails: DatabaseDetails) {
		super(app);
		this.plugin = plugin;
		this.settingTab = settingTab;
		this.dbDetails = dbDetails;
	}

	display() {
		this.containerEl.addClass("delete-modal");
		this.titleEl.setText('Delete Database');

		let { contentEl } = this;
		contentEl.empty();

		const deleteDiv = contentEl.createDiv('delete-div');
		deleteDiv.createEl('h4', { text: 'Are you sure you want to delete the following database?' });
		deleteDiv.createEl('h2', { text: this.dbDetails.fullName + ' (' + this.dbDetails.abName + ', ' + this.dbDetails.format + ')' });


		// add delete button
		let footerEl = contentEl.createDiv('save-button');
		let deleteButton = new Setting(footerEl)

		deleteButton
			.addButton((button: ButtonComponent): ButtonComponent => {
				return button
					.setTooltip("Delete")
					.setIcon("trash")
					.onClick(async () => {
						this.data.deleted = true;
						this.close();
					})
			});

		deleteButton.addExtraButton((button) => {
			return button
				.setTooltip('Cancel')
				.setIcon('cross')
				.onClick(() => {
					this.data.deleted = false;
					this.close();
				});
		});

	}


	onOpen() {
		this.display();
	}

}
