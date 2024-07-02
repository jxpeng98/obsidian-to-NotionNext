import {App, Notice, requestUrl, TFile} from "obsidian";
import {Client} from '@notionhq/client';
import {markdownToBlocks,} from "@tryfabric/martian";
import * as yamlFrontMatter from "yaml-front-matter";
// import * as yaml from "yaml"
import MyPlugin from "src/main";
import {DatabaseDetails} from "../../ui/settingTabs";

export class UploadBaseCustom {
    plugin: MyPlugin;
    notion: Client;
    agent: any;
	dbDetails: DatabaseDetails

    constructor(plugin: MyPlugin, dbDetails: DatabaseDetails) {
        this.plugin = plugin;
		this.dbDetails = dbDetails
    }

    async deletePage(notionID: string) {
		const {notionAPI} = this.dbDetails
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
		const {notionAPI} = this.dbDetails
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
}
