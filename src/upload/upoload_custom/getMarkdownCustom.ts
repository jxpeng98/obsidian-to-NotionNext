import {App, Notice} from "obsidian";
import {i18nConfig} from "../../lang/I18n";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";

export async function getNowFileMarkdownContentCustom(
    app: App,
	dbDetails: DatabaseDetails,
    settings: PluginSettings,
) {
    const nowFile = app.workspace.getActiveFile();
    let cover = '';
	let customValues: Record<string, any> = {}; // Change 'any' to a more specific type if possible

    const FileCache = app.metadataCache.getFileCache(nowFile);
    try {
            cover = FileCache.frontmatter.coverurl;

		// Get custom property names from dbDetails
		const customPropertyNames = dbDetails.customProperties.map(property => property.customValue);

		// Extract custom values from the frontmatter based on the names
		customPropertyNames.forEach(propertyName => {
			if (FileCache.frontmatter[propertyName] !== undefined) {
				customValues[propertyName] = FileCache.frontmatter[propertyName];
			}
		});
    } catch (error) {
        new Notice(i18nConfig["set-tags-fail"]);
    }

    if (nowFile) {
        const markDownData = await nowFile.vault.read(nowFile);
        return {
            markDownData,
            nowFile,
            cover,
            customValues,
        };
    } else {
        new Notice(i18nConfig["open-file"]);
        return;
    }
}
