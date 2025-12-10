import { App, Editor, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, TFile, EventRef } from "obsidian";
import { addIcons } from 'src/ui/icon';
import { i18nConfig } from "src/lang/I18n";
import ribbonCommands from "src/commands/NotionCommands";
import { ObsidianSettingTab, PluginSettings, DEFAULT_SETTINGS, DatabaseDetails } from "src/ui/settingTabs";
import { uploadCommandNext, uploadCommandGeneral, uploadCommandCustom } from "src/upload/uploadCommand";
import { DEFAULT_AUTO_SYNC_DATABASE_KEY, parseAutoSyncDatabaseList, resolveAutoSyncKey } from "src/utils/frontmatter";

// Remember to rename these classes and interfaces!


export default class ObsidianSyncNotionPlugin extends Plugin {
    settings: PluginSettings;
    commands: ribbonCommands;
    app: App;
    modifyEventRef: EventRef | null = null;
    autoSyncTimeout: number | null = null;
    private syncingFiles: Set<string> = new Set();
    private lastFrontmatterCache: Map<string, any> = new Map();
    private lastContentHashCache: Map<string, string> = new Map();
    private missingAutoSyncNoticeShown: Set<string> = new Set();

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
        this.lastFrontmatterCache.clear();
        this.lastContentHashCache.clear();
        this.missingAutoSyncNoticeShown.clear();
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
        if (typeof this.settings.autoSyncFrontmatterKey !== 'string') {
            this.settings.autoSyncFrontmatterKey = DEFAULT_AUTO_SYNC_DATABASE_KEY;
        }
        this.settings.autoSyncFrontmatterKey = resolveAutoSyncKey(this.settings.autoSyncFrontmatterKey);

        // Ensure databaseDetails exists
        if (!this.settings.databaseDetails || typeof this.settings.databaseDetails !== 'object') {
            this.settings.databaseDetails = {};
        }

        // Save settings if any migration was needed
        const needsSave = !loadedData ||
            loadedData.autoSync === undefined ||
            loadedData.autoSyncDelay === undefined ||
            loadedData.NotionLinkDisplay === undefined ||
            loadedData.autoSyncFrontmatterKey === undefined;

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
            autoSyncFrontmatterKey: this.settings.autoSyncFrontmatterKey,
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
        if (typeof this.settings.autoSyncFrontmatterKey !== 'string' || this.settings.autoSyncFrontmatterKey.trim().length === 0) {
            console.warn('[Settings] Invalid autoSyncFrontmatterKey, resetting to default');
            this.settings.autoSyncFrontmatterKey = DEFAULT_AUTO_SYNC_DATABASE_KEY;
        } else {
            this.settings.autoSyncFrontmatterKey = resolveAutoSyncKey(this.settings.autoSyncFrontmatterKey);
        }
    }

    resetAutoSyncNoticeCache() {
        this.missingAutoSyncNoticeShown.clear();
    }

    getAutoSyncFrontmatterKey(): string {
        return resolveAutoSyncKey(this.settings.autoSyncFrontmatterKey);
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
            this.autoSyncTimeout = window.setTimeout(async () => {
                await this.autoSyncFile(file);
            }, delayMs);
        });
    }

    onlyNotionIDChanged(oldFrontmatter: any, newFrontmatter: any): boolean {
        // Get all keys from both frontmatters
        const oldKeys = Object.keys(oldFrontmatter || {});
        const newKeys = Object.keys(newFrontmatter || {});

        // Filter out NotionID-related keys and Obsidian internal keys
        const isIgnoredKey = (key: string) => {
            return key.startsWith('NotionID-') ||
                key === 'NotionID' ||
                key === 'position'; // Obsidian's internal metadata
        };
        const oldNonNotionKeys = oldKeys.filter(k => !isIgnoredKey(k)).sort();
        const newNonNotionKeys = newKeys.filter(k => !isIgnoredKey(k)).sort();

        // If number of non-NotionID keys changed, something else changed
        if (oldNonNotionKeys.length !== newNonNotionKeys.length) {
            console.log('[AutoSync] Frontmatter: Key count changed:', oldNonNotionKeys.length, '->', newNonNotionKeys.length);
            return false;
        }

        // Check if any non-NotionID key values changed
        for (const key of oldNonNotionKeys) {
            if (!newNonNotionKeys.includes(key)) {
                console.log('[AutoSync] Frontmatter: Key removed or added:', key);
                return false; // Key was removed or added
            }
            // Deep comparison for the value
            const oldValue = JSON.stringify(oldFrontmatter[key]);
            const newValue = JSON.stringify(newFrontmatter[key]);
            if (oldValue !== newValue) {
                console.log('[AutoSync] Frontmatter: Value changed for key "' + key + '"');
                console.log('  Old:', oldValue.substring(0, 100));
                console.log('  New:', newValue.substring(0, 100));
                return false; // Value changed
            }
        }

        // Check if any new non-NotionID keys were added
        for (const key of newNonNotionKeys) {
            if (!oldNonNotionKeys.includes(key)) {
                console.log('[AutoSync] Frontmatter: New key added:', key);
                return false; // New key was added
            }
        }

        // Only NotionID fields changed (or nothing in frontmatter changed)
        return true;
    }

    simpleHash(str: string): string {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString();
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

            // Get file content hash for comparison
            const content = await this.app.vault.read(file);
            const contentHash = this.simpleHash(content);
            const lastContentHash = this.lastContentHashCache.get(file.path);

            // Check if only NotionID fields changed (to avoid sync loops)
            const lastFrontmatter = this.lastFrontmatterCache.get(file.path);

            if (lastFrontmatter && lastContentHash) {
                const frontmatterOnlyNotionIDChanged = this.onlyNotionIDChanged(lastFrontmatter, frontMatter);
                const contentUnchanged = contentHash === lastContentHash;

                console.log(`[AutoSync] Change analysis for ${file.basename}:`, {
                    frontmatterOnlyNotionIDChanged,
                    contentUnchanged,
                    frontmatterHasRealChanges: !frontmatterOnlyNotionIDChanged,
                    contentChanged: !contentUnchanged,
                    willSync: !(frontmatterOnlyNotionIDChanged && contentUnchanged)
                });

                // Only skip sync if BOTH conditions are true:
                // 1. Frontmatter only has NotionID changes (no real user changes)
                // 2. Content is completely unchanged
                if (frontmatterOnlyNotionIDChanged && contentUnchanged) {
                    console.log(`[AutoSync] Only NotionID updated (from sync), content unchanged - skipping auto sync`);
                    // Update cache even when skipping, so next comparison uses the current state
                    this.lastFrontmatterCache.set(file.path, { ...frontMatter });
                    this.lastContentHashCache.set(file.path, contentHash);
                    return;
                }

                if (!contentUnchanged) {
                    console.log(`[AutoSync] Content changed - will sync`);
                } else if (!frontmatterOnlyNotionIDChanged) {
                    console.log(`[AutoSync] Frontmatter changed - will sync`);
                }
            }

            const autoSyncKey = this.getAutoSyncFrontmatterKey();
            const autoSyncTargets = parseAutoSyncDatabaseList(frontMatter[autoSyncKey]);

            if (autoSyncTargets.length === 0) {
                if (!this.missingAutoSyncNoticeShown.has(file.path)) {
                    const message = i18nConfig.AutoSyncMissingDatabaseList.replace('{key}', autoSyncKey);
                    new Notice(message, 10000);
                    this.missingAutoSyncNoticeShown.add(file.path);
                }
                console.log(`[AutoSync] No auto sync database list found in ${file.path} using key "${autoSyncKey}"`);
                return;
            }

            this.missingAutoSyncNoticeShown.delete(file.path);

            const dbByShortName = new Map<string, DatabaseDetails>();
            for (const key in this.settings.databaseDetails) {
                const dbDetails = this.settings.databaseDetails[key];
                dbByShortName.set(dbDetails.abName.toLowerCase(), dbDetails);
            }

            const foundDatabases: Array<{ dbDetails: DatabaseDetails, notionId: string | undefined }> = [];
            const unresolvedTargets: string[] = [];

            for (const target of autoSyncTargets) {
                const lookupKey = target.toLowerCase();
                const dbDetails = dbByShortName.get(lookupKey);

                if (!dbDetails) {
                    unresolvedTargets.push(target);
                    continue;
                }

                const notionIDKey = `NotionID-${dbDetails.abName}`;
                // Include database even if no NotionID exists (for first-time upload)
                foundDatabases.push({
                    dbDetails,
                    notionId: frontMatter[notionIDKey] ? String(frontMatter[notionIDKey]) : undefined
                });
            }

            if (unresolvedTargets.length > 0) {
                console.log(`[AutoSync] Frontmatter auto sync targets not found in settings: ${unresolvedTargets.join(", ")}`);
            }

            // If no valid databases found in settings, skip
            if (foundDatabases.length === 0) {
                console.log(`[AutoSync] No matching databases found in settings for ${file.path}, skipping auto sync`);
                return;
            }

            // Notify user about multiple syncs if applicable
            if (foundDatabases.length > 1) {
                const message = i18nConfig.AutoSyncMultipleSync.replace('{count}', String(foundDatabases.length));
                new Notice(message, 3000);
                console.log(`[AutoSync] Found ${foundDatabases.length} database targets in ${file.path}`);
            }

            // Sync to all found databases
            for (const { dbDetails, notionId } of foundDatabases) {
                const isFirstSync = !notionId;
                console.log(`[AutoSync] ${new Date().toISOString()} Auto syncing ${file.basename} to ${dbDetails.fullName} (${dbDetails.abName})${isFirstSync ? ' [First Upload]' : ''}`);

                try {
                    // Trigger appropriate upload command based on database format
                    if (dbDetails.format === 'next') {
                        await uploadCommandNext(this, this.settings, dbDetails, this.app);
                    } else if (dbDetails.format === 'general') {
                        await uploadCommandGeneral(this, this.settings, dbDetails, this.app);
                    } else if (dbDetails.format === 'custom') {
                        await uploadCommandCustom(this, this.settings, dbDetails, this.app);
                    }
                } catch (error) {
                    console.error(`[AutoSync] Error syncing to ${dbDetails.fullName}:`, error);
                    const message = i18nConfig.AutoSyncFailed
                        .replace('{database}', dbDetails.fullName)
                        .replace('{error}', error.message);
                    new Notice(message, 5000);
                }
            }

            // After sync completes, update cache with the latest frontmatter (including updated NotionIDs)
            // Wait a bit for metadata cache to update
            window.setTimeout(async () => {
                const updatedFrontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
                const updatedContent = await this.app.vault.read(file);
                const updatedHash = this.simpleHash(updatedContent);

                if (updatedFrontmatter) {
                    this.lastFrontmatterCache.set(file.path, { ...updatedFrontmatter });
                    this.lastContentHashCache.set(file.path, updatedHash);
                    console.log(`[AutoSync] Cached updated frontmatter and content hash for ${file.path}`);
                }
            }, 500);

        } catch (error) {
            console.error(`[AutoSync] Error syncing file ${file.path}:`, error);
            const message = i18nConfig.AutoSyncError
                .replace('{filename}', file.basename)
                .replace('{error}', error.message);
            new Notice(message);
        } finally {
            this.syncingFiles.delete(file.path);
        }
    }
}
