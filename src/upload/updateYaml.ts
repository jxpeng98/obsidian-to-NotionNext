import { App, Notice, TFile } from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import { DatabaseDetails } from "../ui/settingTabs";
import { i18nConfig } from "src/lang/I18n";

export async function updateYamlInfo(
    yamlContent: string,
    nowFile: TFile,
    res: any,
    app: App,
    plugin: ObsidianSyncNotionPlugin,
    dbDetails: DatabaseDetails,
) {
    let { url, id } = res;
    // replace www to notionID
    const { notionUser, NotionLinkDisplay } = plugin.settings;
    const { abName } = dbDetails
    const notionIDKey = `NotionID-${abName}`;
    const linkKey = `link-${abName}`;

    if (notionUser !== "") {
        // replace url str "www" to notionID
        url = url.replace("www.notion.so", `${notionUser}.notion.site`)
    }

    await app.fileManager.processFrontMatter(nowFile, yamlContent => {
        if (yamlContent[notionIDKey]) {
            delete yamlContent[notionIDKey]
        }
        if (yamlContent[linkKey]) {
            delete yamlContent[linkKey]
        }
        // add new notionID and link
        yamlContent[notionIDKey] = id;
        (NotionLinkDisplay) ? yamlContent[linkKey] = url : null;
    });

    try {
        await navigator.clipboard.writeText(url)
    } catch (error) {
        console.log(error)
        new Notice(`${i18nConfig.CopyErrorMessage}`);
    }
}
