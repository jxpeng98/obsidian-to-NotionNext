import {App, Notice} from "obsidian";
import {i18nConfig} from "../../lang/I18n";
import {PluginSettings} from "../../ui/settingTabs";

export async function getNowFileMarkdownContentCustom(
    app: App,
    settings: PluginSettings,
) {
    const nowFile = app.workspace.getActiveFile();
    let cover = '';
    let tags = [];
    let customValues: Record<string, string> = {};

    const FileCache = app.metadataCache.getFileCache(nowFile);
    try {
            cover = FileCache.frontmatter.coverurl;
            tags = FileCache.frontmatter.tags;

            // split the CustomValues into an array
            const customValuesNames = settings.CustomValues.split('\n').map(value => value.trim());

            // get the custom values from the frontmatter
            customValuesNames.forEach(valueName => {
                customValues[valueName] = FileCache.frontmatter[valueName];
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
            tags,
            customValues,
        };
    } else {
        new Notice(i18nConfig["open-file"]);
        return;
    }
}
