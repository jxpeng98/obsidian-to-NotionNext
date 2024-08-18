import { App, Notice, requestUrl, TFile } from "obsidian";
import { Client } from '@notionhq/client';
import { markdownToBlocks, } from "@jxpeng98/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import { DatabaseDetails } from "../../ui/settingTabs";

export class UploadBaseNext {
    plugin: MyPlugin;
    notion: Client;
    agent: any;
    dbDetails: DatabaseDetails

    constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
        this.plugin = plugin;
        this.dbDetails = dbDetails
    }

    async deletePage(notionID: string) {
        const { notionAPI } = this.dbDetails
        return requestUrl({
            url: `https://api.notion.com/v1/blocks/${notionID}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + notionAPI,
                'Notion-Version': '2022-06-28',
            },
            body: ''
        });
    }

    async getDataBase(databaseID: string) {
        const { notionAPI } = this.dbDetails

        const response = await requestUrl({
            url: `https://api.notion.com/v1/databases/${databaseID}`,
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + notionAPI,
                'Notion-Version': '2022-06-28',
            }
        }
        )

        // Check if cover is present in the JSON response and then get the URL
        if (response.json.cover && response.json.cover.external) {
            return response.json.cover.external.url;
        } else {
            return null;  // or some other default value, if you prefer
        }
    }

    // async updateYamlInfo(yamlContent: string, nowFile: TFile, res: any, app: App, settings: any) {
    //     let {url, id} = res.json
    //     // replace www to notionID
    //     const { notionUser} = this.plugin.settings;
    //
    //     if (notionUser !== "") {
    //         // replace url str "www" to notionID
    //         url = url.replace("www.notion.so", `${notionUser}.notion.site`)
    //     }
    //
    //     await app.fileManager.processFrontMatter(nowFile, yamlContent => {
    //         if (yamlContent['notionID']) {
    //             delete yamlContent['notionID']
    //         }
    //         if (yamlContent['link']) {
    //             delete yamlContent['link']
    //         }
    //         // add new notionID and link
    //         yamlContent.notionID = id;
    //         yamlContent.link = url;
    //     });
    //
    //     try {
    //         await navigator.clipboard.writeText(url)
    //     } catch (error) {
    //         new Notice(`复制链接失败，请手动复制${error}`)
    //     }
    //     // const __content = yamlContent.__content;
    //     // delete yamlContent.__content
    //     // const yamlhead = yaml.stringify(yamlContent)
    //     // //  if yamlhead hava last \n  remove it
    //     // const yamlhead_remove_n = yamlhead.replace(/\n$/, '')
    //     // // if __content have start \n remove it
    //     // const __content_remove_n = __content.replace(/^\n/, '')
    //     // const content = '---\n' +yamlhead_remove_n +'\n---\n' + __content_remove_n;
    //     // try {
    //     // 	await nowFile.vault.modify(nowFile, content)
    //     // } catch (error) {
    //     // 	new Notice(`write file error ${error}`)
    //     // }
    // }
}
