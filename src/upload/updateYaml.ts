import { App, Notice, TFile } from "obsidian";
import ObsidianSyncNotionPlugin from "../main";
import { PluginSettings } from "../ui/settingTabs";

export async function updateYamlInfo(
    yamlContent: string,
    nowFile: TFile,
    res: any,
    app: App,
    plugin: ObsidianSyncNotionPlugin,
) {
    let { url, id } = res.json
    // replace www to notionID
    const { notionUser } = plugin.settings;

    if (notionUser !== "") {
        // replace url str "www" to notionID
        url = url.replace("www.notion.so", `${notionUser}.notion.site`)
    }

    await app.fileManager.processFrontMatter(nowFile, yamlContent => {
        if (yamlContent['notionID']) {
            delete yamlContent['notionID']
        }
        if (yamlContent['link']) {
            delete yamlContent['link']
        }
        // add new notionID and link
        yamlContent.notionID = id;
        yamlContent.link = url;
    });

    try {
        await navigator.clipboard.writeText(url)
    } catch (error) {
        new Notice(`复制链接失败，请手动复制${error}`)
    }
    // const __content = yamlContent.__content;
    // delete yamlContent.__content
    // const yamlhead = yaml.stringify(yamlContent)
    // //  if yamlhead hava last \n  remove it
    // const yamlhead_remove_n = yamlhead.replace(/\n$/, '')
    // // if __content have start \n remove it
    // const __content_remove_n = __content.replace(/^\n/, '')
    // const content = '---\n' +yamlhead_remove_n +'\n---\n' + __content_remove_n;
    // try {
    // 	await nowFile.vault.modify(nowFile, content)
    // } catch (error) {
    // 	new Notice(`write file error ${error}`)
    // }
}
