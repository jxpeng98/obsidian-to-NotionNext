import {i18nConfig} from "src/lang/I18n";
import {Editor, MarkdownView} from "obsidian";
import {FuzzySuggester, DatabaseList} from "./FuzzySuggester";
import {uploadCommand} from "../upload/uploadCommand";
import ObsidianSyncNotionPlugin from "src/main";

// create the commands list
export default class RibbonCommands {
    plugin: ObsidianSyncNotionPlugin;

    // Total commands that will be used
    Ncommand = [
        {
            id: "share-to-notionnext",
            name: i18nConfig.ribbonIcon, // Use the translated text from i18nConfig
            editorCallback: async (editor: Editor, view: MarkdownView) => {
                // await this.plugin.uploadCommand()
                await uploadCommand(this.plugin, this.plugin.settings, this.plugin.app)
            }
        },
        // {
        //     id: "share-to-notion",
        //     name: i18nConfig.CommandNameGeneral, // Use the translated text from i18nConfig
        //     editorCallback: async (editor: Editor, view: MarkdownView) => {
        //         await this.plugin.upload();
        //     }
        // }
    ];

    async ribbonDisplay() {
        const NcommandList: DatabaseList[] = [];
        this.Ncommand.map(command => NcommandList.push(
            {
                name:command.name,
                match: command.editorCallback
            }
            )
        );

        const fusg = new FuzzySuggester(this.plugin);

        fusg.setSuggesterData(NcommandList);
        await fusg.display(async (results) => {await results.match()})
    };

    constructor(plugin: ObsidianSyncNotionPlugin) {
        this.plugin = plugin;

        // Register all the commands
        this.Ncommand.forEach(command => {
            this.plugin.addCommand(
                {
                    id: command.id,
                    name: command.name,
                    editorCallback: command.editorCallback,
                }
                );
        });
    }

}
