import {App, Notice, TAbstractFile, TFile} from "obsidian";
import {i18nConfig} from "../../lang/I18n";
import {DatabaseDetails, PluginSettings} from "../../ui/settingTabs";

export async function getNowFileMarkdownContentCustom(
    app: App,
	dbDetails: DatabaseDetails,
    settings: PluginSettings,
) {
    const nowFile = app.workspace.getActiveFile();
	if (!nowFile) {
		new Notice(i18nConfig["open-file"]);
		return;
	}
	let cover = '';
	let customValues: Record<string, any> = {};

    const FileCache = app.metadataCache.getFileCache(nowFile);
    try {
            cover = FileCache.frontmatter.coverurl;

		// Get custom property names from dbDetails
		const customPropertyValues = dbDetails.customProperties.map(property => property.customName);

		// Extract custom values from the frontmatter based on the names
		customPropertyValues.forEach( propertyName => {
			if (FileCache.frontmatter[propertyName] !== undefined) {
				customValues[propertyName] = FileCache.frontmatter[propertyName];
			}
		});

		customValues['title'] = nowFile.basename; // Use 'basename' for the file name without extension

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
