import { App, PluginSettingTab, Setting } from "obsidian";
import { i18nConfig } from "../lang/I18n";
import ObsidianSyncNotionPlugin from "../main";

export interface PluginSettings {
    NextButton: boolean;
    notionAPINext: string;
    databaseIDNext: string;
    bannerUrl: string;
    notionUser: string;
    proxy: string;
    GeneralButton: boolean;
    CustomTitleButton: boolean;
    CustomTitleName: string;
    notionAPIGeneral: string;
    databaseIDGeneral: string;
    CustomButton: boolean;
    notionAPICustom: string;
    databaseIDCustom: string;
}

export const DEFAULT_SETTINGS: PluginSettings = {
    NextButton: true,
    notionAPINext: "",
    databaseIDNext: "",
    bannerUrl: "",
    notionUser: "",
    proxy: "",
    GeneralButton: true,
    CustomTitleButton: false,
    CustomTitleName: "",
    notionAPIGeneral: "",
    databaseIDGeneral: "",
    CustomButton: false,
    notionAPICustom: "",
    databaseIDCustom: "",
};


export class ObsidianSettingTab extends PluginSettingTab {
    plugin: ObsidianSyncNotionPlugin;

    constructor(app: App, plugin: ObsidianSyncNotionPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        // General Settings
        containerEl.createEl('h2', { text: i18nConfig.GeneralSetting });

        new Setting(containerEl)
            .setName(i18nConfig.BannerUrl)
            .setDesc(i18nConfig.BannerUrlDesc)
            .addText((text) =>
                text
                    .setPlaceholder(i18nConfig.BannerUrlText)
                    .setValue(this.plugin.settings.bannerUrl)
                    .onChange(async (value) => {
                        this.plugin.settings.bannerUrl = value;
                        await this.plugin.saveSettings();
                    })
            );


        new Setting(containerEl)
            .setName(i18nConfig.NotionUser)
            .setDesc(i18nConfig.NotionUserDesc)
            .addText((text) =>
                text
                    .setPlaceholder(i18nConfig.NotionUserText)
                    .setValue(this.plugin.settings.notionUser)
                    .onChange(async (value) => {
                        this.plugin.settings.notionUser = value;
                        await this.plugin.saveSettings();
                    })
            );

        containerEl.createEl('h2', { text: i18nConfig.NotionNextSettingHeader })

        new Setting(containerEl)
            .setName(i18nConfig.NotionNextButton)
            .setDesc(i18nConfig.NotionNextButtonDesc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.NextButton)
                    .onChange(async (value) => {
                        this.plugin.settings.NextButton = value;
                        await this.plugin.saveSettings();
                        await this.plugin.commands.updateCommand();

                        // Clear existing components
                        notionAPINextEl.empty();
                        databaseIDNextEl.empty();

                        if (value) {
                            new Setting(notionAPINextEl)
                                .setName(i18nConfig.NotionAPI)
                                .setDesc(i18nConfig.NotionAPIDesc)
                                .addText((text) => {
                                    text.inputEl.type = 'password';
                                    return text
                                        .setPlaceholder(i18nConfig.NotionAPIText)
                                        .setValue(this.plugin.settings.notionAPINext)
                                        .onChange(async (value) => {
                                            this.plugin.settings.notionAPINext = value;
                                            await this.plugin.saveSettings();
                                        })
                                });

							this.updateSettingEl(notionAPINextEl, value);

                            new Setting(databaseIDNextEl)
                                .setName(i18nConfig.DatabaseID)
                                .setDesc(i18nConfig.NotionAPIDesc)
                                .addText((text) => {
                                    text.inputEl.type = 'password';
                                    return text
                                        .setPlaceholder(i18nConfig.DatabaseIDText)
                                        .setValue(this.plugin.settings.databaseIDNext)
                                        .onChange(async (value) => {
                                            this.plugin.settings.databaseIDNext = value;
                                            await this.plugin.saveSettings();
                                        })
                                }
                                );

							this.updateSettingEl(databaseIDNextEl, value)

                        } else {
							this.updateSettingEl(notionAPINextEl, false)
							this.updateSettingEl(databaseIDNextEl, false);
                        }
                    })
            );

        const notionAPINextEl = this.createStyleDiv('api-next')

        const databaseIDNextEl = this.createStyleDiv('databaseID-next')



        // notionDatabaseID.controlEl.querySelector('input').type='password'


        // General Database Settings
        containerEl.createEl('h2', { text: i18nConfig.NotionGeneralSettingHeader });

        // new Setting(containerEl)
        //     .setName(i18nConfig.NotYetFinish)
        new Setting(containerEl)
            .setName(i18nConfig.NotionGeneralButton)
            .setDesc(i18nConfig.NotionGeneralButtonDesc)
            .addToggle((toggle) =>
                toggle
                    .setValue(this.plugin.settings.GeneralButton)
                    .onChange(async (value) => {
                        this.plugin.settings.GeneralButton = value;
                        await this.plugin.saveSettings();
                        await this.plugin.commands.updateCommand();

                        // Clear existing components
                        CustomTitleEl.empty();
                        notionAPIGeneralEl.empty();
                        databaseIDGeneralEl.empty();

                        if (value) {
                            new Setting(CustomTitleEl)
                                .setName(i18nConfig.NotionCustomTitle)
                                .setDesc(i18nConfig.NotionCustomTitleDesc)
                                .addToggle((toggle) =>
                                    toggle
                                        .setValue(this.plugin.settings.CustomTitleButton)
                                        .onChange(async (value) => {
                                            this.plugin.settings.CustomTitleButton = value;
                                            await this.plugin.saveSettings();
                                            await this.plugin.commands.updateCommand();

                                            // Clear existing components
                                            CustomNameEl.empty();

                                            // Add new components based on the toggle value
                                            if (this.plugin.settings.CustomTitleButton) {
                                                new Setting(CustomNameEl)
                                                    .setName(i18nConfig.NotionCustomTitleName)
                                                    .setDesc(i18nConfig.NotionCustomTitleNameDesc)
                                                    .addText((text) =>
                                                        text
                                                            .setPlaceholder(i18nConfig.NotionCustomTitleText)
                                                            .setValue(this.plugin.settings.CustomTitleName)
                                                            .onChange(async (value) => {
                                                                this.plugin.settings.CustomTitleName = value;
                                                                await this.plugin.saveSettings();
                                                                await this.plugin.commands.updateCommand();

                                                                // Clear existing components
                                                                CustomTitleEl.empty();
                                                            })
                                                    );
												this.updateSettingEl(CustomNameEl, value)
                                            } else {
                                            this.updateSettingEl(CustomNameEl, false);
											}
                                        })
                                );

							this.updateSettingEl(CustomTitleEl, value);

                            new Setting(notionAPIGeneralEl)
                                .setName(i18nConfig.NotionAPI)
                                .setDesc(i18nConfig.NotionAPIDesc)
                                .addText((text) => {
                                    text.inputEl.type = 'password';
                                    return text
                                        .setPlaceholder(i18nConfig.NotionAPIText)
                                        .setValue(this.plugin.settings.notionAPIGeneral)
                                        .onChange(async (value) => {
                                            this.plugin.settings.notionAPIGeneral = value;
                                            await this.plugin.saveSettings();
                                        })
                                });

							this.updateSettingEl(notionAPIGeneralEl, value);


                            new Setting(databaseIDGeneralEl)
                                .setName(i18nConfig.DatabaseID)
                                .setDesc(i18nConfig.NotionAPIDesc)
                                .addText((text) => {
                                    text.inputEl.type = 'password';
                                    return text
                                        .setPlaceholder(i18nConfig.NotionIDText)
                                        .setValue(this.plugin.settings.databaseIDGeneral)
                                        .onChange(async (value) => {
                                            this.plugin.settings.databaseIDGeneral = value;
                                            await this.plugin.saveSettings();
                                        })
                                }
                                );

							this.updateSettingEl(databaseIDGeneralEl, value);

                        } else {
							this.updateSettingEl(CustomTitleEl, false);
							this.updateSettingEl(notionAPIGeneralEl, false);
							this.updateSettingEl(databaseIDGeneralEl, false);
                        }
                    })
            );

		const CustomTitleEl = this.createStyleDiv('custom-title');

		const CustomNameEl = this.createStyleDiv('custom-name');

        // new Setting(containerEl)
        // .setName("Convert tags(optional)")
        // .setDesc("Transfer the Obsidian tags to the Notion table. It requires the column with the name 'Tags'")
        // .addToggle((toggle) =>
        // 	toggle
        // 		.setValue(this.plugin.settings.allowTags)
        // 		.onChange(async (value) => {
        // 			this.plugin.settings.allowTags = value;
        // 			await this.plugin.saveSettings();
        // 		})
        // );

		const notionAPIGeneralEl = this.createStyleDiv('api-general');

		const databaseIDGeneralEl = this.createStyleDiv('databaseID-general');

        // Custom Database Settings

        // containerEl.createEl('h2', {text: i18nConfig.NotionCustomSettingHeader});
        //
        // new Setting(containerEl)
        // 	.setName(i18nConfig.NotionCustomButton)
        // 	.setDesc(i18nConfig.NotionCustomButtonDesc)
        // 	.addToggle((toggle) =>
        // 		toggle
        // 			.setValue(this.plugin.settings.CustomButton)
        // 			.onChange(async (value) => {
        // 				this.plugin.settings.CustomButton = value;
        // 				await this.plugin.saveSettings();
        // 			})
        // 	);
    }

	// create a function to create a div with a style for pop over elements
	private createStyleDiv(className: string | DomElementInfo) {
        return this.containerEl.createDiv(className, (div) => {
			div.style.alignItems = "center";
			div.style.borderTop = "none";
			div.style.paddingBottom = "0";
		});
    }

	// function to add one setting element in the setting tab.
	private createSettingEl(containerEl: HTMLElement, name: string, desc: string, type:string, placeholder: string, setvalue: any) {
		if (type === 'password') {
			return new Setting(containerEl)
				.setName(name)
				.setDesc(desc)
				.addText((text) => {
					text.inputEl.type = type;
					return text
						.setPlaceholder(placeholder)
						.setValue(setvalue)
						.onChange(async (value) => {
							setvalue = value;
							await this.plugin.saveSettings();
                        })
                }
				)
        } else if (type === 'toggle') {
			return new Setting(containerEl)
				.setName(name)
				.setDesc(desc)
				.addToggle((toggle) =>
					toggle
						.setValue(setvalue)
						.onChange(async (value) => {
							setvalue = value;
							await this.plugin.saveSettings();
							await this.plugin.commands.updateCommand();
						})
				)
		} else if (type === 'text') {
			new Setting(containerEl)
				.setName(name)
				.setDesc(desc)
				.addText((text) =>
					text
						.setPlaceholder(placeholder)
						.setValue(setvalue)
						.onChange(async (value) => {
							setvalue = value;
							await this.plugin.saveSettings();
							await this.plugin.commands.updateCommand();
                        })
				)
        }
	}

	// update the setting display style in the setting tab
	private updateSettingEl(element: HTMLElement, value: boolean) {
		element.style.borderTop = value ? "1px solid var(--background-modifier-border)" : "none";
		element.style.paddingTop = value ? "0.75em" : "0";
    }
}
