import {App, Notice} from "obsidian";
import {i18nConfig} from "../../lang/I18n";
import {DatabaseDetails} from "../../ui/settingTabs";

export async function getNowFileMarkdownContentCustom(
	app: App,
	dbDetails: DatabaseDetails,
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

		// Get custom property names from dbDetails excluding the title type property
		const customPropertyNames = dbDetails.customProperties
			.filter(property => property.customType !== 'title') // Exclude 'title' type property
			.map(property => property.customName);

		// Extract custom values from the front matter based on the names
		// Only collect data 'Relation' should be handled separately in the function buildBodyString
		customPropertyNames.forEach(propertyName => {
			if (FileCache.frontmatter && FileCache.frontmatter[propertyName] !== undefined) {
				customValues[propertyName] = FileCache.frontmatter[propertyName];
			}
		});

		// Check if any of the customProperties has a customType of 'title'
		const titleProperty = dbDetails.customProperties
			.find(property => property.customType === 'title');

		// If a 'title' type property exists, use the file's basename as its value
		if (titleProperty) {
			customValues[titleProperty.customName] =
				(FileCache.frontmatter && FileCache.frontmatter[titleProperty.customName]) ?
					FileCache.frontmatter[titleProperty.customName] : // use the front matter value if it exists
					nowFile.basename; // Use 'basename' for the file name without extension
		}

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
