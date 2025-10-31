import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile, EventRef } from "obsidian";
import { addIcons } from 'src/ui/icon';
import { i18nConfig } from "src/lang/I18n";
import ribbonCommands from "src/commands/NotionCommands";
import { ObsidianSettingTab, PluginSettings, DEFAULT_SETTINGS, DatabaseDetails } from "src/ui/settingTabs";
import { uploadCommandNext, uploadCommandGeneral, uploadCommandCustom } from "src/upload/uploadCommand";

// Remember to rename these classes and interfaces!


export default class ObsidianSyncNotionPlugin extends Plugin {
    settings: PluginSettings;
    commands: ribbonCommands;
    app: App;
    modifyEventRef: EventRef | null = null;
    autoSyncTimeout: NodeJS.Timeout | null = null;
    private syncingFiles: Set<string> = new Set();

    async onload() {
        await this.loadSettings();

        // Log loaded settings for debugging
        console.log('[Plugin] Loaded settings:', {
            autoSync: this.settings.autoSync,
            autoSyncDelay: this.settings.autoSyncDelay,
            NotionLinkDisplay: this.settings.NotionLinkDisplay,
            bannerUrl: this.settings.bannerUrl ? 'set' : 'empty',
            notionUser: this.settings.notionUser ? 'set' : 'empty',
            databaseCount: Object.keys(this.settings.databaseDetails || {}).length
        });

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

        // Setup auto sync listener
        this.setupAutoSync();

    }

    onunload() {
        if (this.modifyEventRef) {
            this.app.vault.offref(this.modifyEventRef);
        }
        if (this.autoSyncTimeout) {
            clearTimeout(this.autoSyncTimeout);
        }
    }

    async loadSettings() {
        const loadedData = await this.loadData();

        // Merge loaded data with defaults, ensuring all fields exist
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            loadedData || {}
        );

        // Ensure critical fields have valid values
        if (typeof this.settings.autoSync !== 'boolean') {
            this.settings.autoSync = DEFAULT_SETTINGS.autoSync;
        }
        if (typeof this.settings.autoSyncDelay !== 'number' || this.settings.autoSyncDelay < 2) {
            this.settings.autoSyncDelay = DEFAULT_SETTINGS.autoSyncDelay;
        }
        if (typeof this.settings.NotionLinkDisplay !== 'boolean') {
            this.settings.NotionLinkDisplay = DEFAULT_SETTINGS.NotionLinkDisplay;
        }

        // Ensure databaseDetails exists
        if (!this.settings.databaseDetails || typeof this.settings.databaseDetails !== 'object') {
            this.settings.databaseDetails = {};
        }

        // Save settings if any migration was needed
        const needsSave = !loadedData ||
            loadedData.autoSync === undefined ||
            loadedData.autoSyncDelay === undefined ||
            loadedData.NotionLinkDisplay === undefined;

        if (needsSave) {
            const migratedFields = [];
            if (!loadedData) {
                console.log('[Settings] First-time setup, creating default settings');
            } else {
                if (loadedData.autoSync === undefined) migratedFields.push('autoSync');
                if (loadedData.autoSyncDelay === undefined) migratedFields.push('autoSyncDelay');
                if (loadedData.NotionLinkDisplay === undefined) migratedFields.push('NotionLinkDisplay');

                console.log('[Settings] Migrating settings, adding fields:', migratedFields.join(', '));
            }

            await this.saveSettings();

            // Notify user about settings migration (only for existing users, not first-time setup)
            if (loadedData && Object.keys(loadedData).length > 0 && migratedFields.length > 0) {
                new Notice(i18nConfig.SettingsMigrated, 6000);
                console.log('[Settings] Migration notice shown to user');
            }
        }
    }

    async saveSettings() {
        // Validate settings before saving
        this.validateSettings();
        await this.saveData(this.settings);
        console.log('[Settings] Settings saved successfully', {
            autoSync: this.settings.autoSync,
            autoSyncDelay: this.settings.autoSyncDelay,
            NotionLinkDisplay: this.settings.NotionLinkDisplay,
            databaseCount: Object.keys(this.settings.databaseDetails || {}).length
        });
    }

    validateSettings() {
        // Ensure all required fields have valid values
        if (typeof this.settings.autoSync !== 'boolean') {
            console.warn('[Settings] Invalid autoSync value, resetting to default');
            this.settings.autoSync = DEFAULT_SETTINGS.autoSync;
        }
        if (typeof this.settings.autoSyncDelay !== 'number' || this.settings.autoSyncDelay < 2) {
            console.warn('[Settings] Invalid autoSyncDelay value, resetting to default');
            this.settings.autoSyncDelay = DEFAULT_SETTINGS.autoSyncDelay;
        }
        if (typeof this.settings.NotionLinkDisplay !== 'boolean') {
            console.warn('[Settings] Invalid NotionLinkDisplay value, resetting to default');
            this.settings.NotionLinkDisplay = DEFAULT_SETTINGS.NotionLinkDisplay;
        }
        if (!this.settings.databaseDetails || typeof this.settings.databaseDetails !== 'object') {
            console.warn('[Settings] Invalid databaseDetails, resetting to empty object');
            this.settings.databaseDetails = {};
        }
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

    setupAutoSync() {
        // Remove existing listener if any
        if (this.modifyEventRef) {
            this.app.vault.offref(this.modifyEventRef);
        }

        // Only setup if autoSync is enabled
        if (!this.settings.autoSync) {
            return;
        }

        // Listen for file modifications
        this.modifyEventRef = this.app.vault.on('modify', async (file: TFile) => {
            // Only process markdown files
            if (!(file instanceof TFile) || file.extension !== 'md') {
                return;
            }

            // Debounce: clear existing timeout
            if (this.autoSyncTimeout) {
                clearTimeout(this.autoSyncTimeout);
            }

            // Set a new timeout to trigger sync after user-configured delay (in seconds)
            const delayMs = (this.settings.autoSyncDelay || 2) * 1000;
            this.autoSyncTimeout = setTimeout(async () => {
                await this.autoSyncFile(file);
            }, delayMs);
        });
    }

    async autoSyncFile(file: TFile) {
        // Check if file is already being synced
        if (this.syncingFiles.has(file.path)) {
            console.log(`[AutoSync] File ${file.path} is already being synced, skipping`);
            return;
        }

        try {
            this.syncingFiles.add(file.path);

            // Get file's frontmatter
            const frontMatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
            if (!frontMatter) {
                console.log(`[AutoSync] No frontmatter found in ${file.path}`);
                return;
            }

            // Find which database this file belongs to by checking for NotionID-{abName}
            let foundDbDetails: DatabaseDetails | null = null;
            let notionId: string | null = null;

            for (const key in this.settings.databaseDetails) {
                const dbDetails = this.settings.databaseDetails[key];
                const notionIDKey = `NotionID-${dbDetails.abName}`;

                if (frontMatter[notionIDKey]) {
                    foundDbDetails = dbDetails;
                    notionId = String(frontMatter[notionIDKey]);
                    break;
                }
            }

            // If no NotionID found, skip auto sync
            if (!foundDbDetails || !notionId) {
                console.log(`[AutoSync] No NotionID found in ${file.path}, skipping auto sync`);
                return;
            }

            console.log(`[AutoSync] ${new Date().toISOString()} Auto syncing ${file.basename} to ${foundDbDetails.fullName}`);

            // Trigger appropriate upload command based on database format
            if (foundDbDetails.format === 'next') {
                await uploadCommandNext(this, this.settings, foundDbDetails, this.app);
            } else if (foundDbDetails.format === 'general') {
                await uploadCommandGeneral(this, this.settings, foundDbDetails, this.app);
            } else if (foundDbDetails.format === 'custom') {
                await uploadCommandCustom(this, this.settings, foundDbDetails, this.app);
            }

        } catch (error) {
            console.error(`[AutoSync] Error syncing file ${file.path}:`, error);
            new Notice(`Auto sync failed for ${file.basename}: ${error.message}`);
        } finally {
            this.syncingFiles.delete(file.path);
        }
    }
}

