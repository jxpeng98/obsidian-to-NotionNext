import {App, Notice} from "obsidian";
import {i18nConfig} from "../../lang/I18n";
import {PluginSettings} from "../../ui/settingTabs";

export async function getNowFileMarkdownContentGeneral(
	app: App,
	settings: PluginSettings,
) {
	const nowFile = app.workspace.getActiveFile();
	let cover = '';
	let tags = [];

	const FileCache = app.metadataCache.getFileCache(nowFile);
	try {
		cover = FileCache.frontmatter.coverurl;
		tags = FileCache.frontmatter.tags;
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
		};
	} else {
		new Notice(i18nConfig["open-file"]);
		return;
	}
}
