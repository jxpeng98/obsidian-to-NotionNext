import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from "obsidian";
import { addIcons } from 'src/ui/icon';
import { i18nConfig } from "src/lang/I18n";
import ribbonCommands from "src/commands/NotionCommands";
import { ObsidianSettingTab, PluginSettings, DEFAULT_SETTINGS, DatabaseDetails } from "src/ui/settingTabs";

// Remember to rename these classes and interfaces!


export default class ObsidianSyncNotionPlugin extends Plugin {
    settings: PluginSettings;
    commands: ribbonCommands;
    app: App;

    async onload() {
        await this.loadSettings();
        this.commands = new ribbonCommands(this);

        addIcons();
        // This creates an icon in the left ribbon.
        this.addRibbonIcon(
            "notion-logo",
            i18nConfig.ribbonIcon,
            async (evt: MouseEvent) => {
                // Called when the user clicks the icon.
                // await this.uploadCommand();
                await this.commands.ribbonDisplay();
            }
        );

        // This adds a status bar item to the bottom of the app. Does not work on mobile apps.

        // const statusBarItemEl = this.addStatusBarItem();
        // // statusBarItemEl.setText("share to notion");

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new ObsidianSettingTab(this.app, this));

    }

    onunload() {
    }

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async addDatabaseDetails(dbDetails: DatabaseDetails) {
        this.settings.databaseDetails = {
            ...this.settings.databaseDetails,
            [dbDetails.abName]: dbDetails,
        };

        await this.saveSettings();
    }

    async deleteDatabaseDetails(dbDetails: DatabaseDetails) {
        delete this.settings.databaseDetails[dbDetails.abName];

        await this.saveSettings();
    }

    async updateDatabaseDetails(dbDetails: DatabaseDetails) {
        // delete the old database details
        delete this.settings.databaseDetails[dbDetails.abName];

        this.settings.databaseDetails = {
            ...this.settings.databaseDetails,
            [dbDetails.abName]: dbDetails,
        };

        await this.saveSettings();
    }

}



