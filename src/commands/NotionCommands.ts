import { i18nConfig } from "src/lang/I18n";
import { Editor, MarkdownView } from "obsidian";
import { FuzzySuggester, DatabaseList } from "./FuzzySuggester";
import { uploadCommandGeneral, uploadCommandNext } from "../upload/uploadCommand";
import ObsidianSyncNotionPlugin from "src/main";


interface Command {
	id: string;
	name: string;
	editorCallback: (editor: Editor, view: MarkdownView) => Promise<void>;
}


// create the commands list
export default class RibbonCommands {
	plugin: ObsidianSyncNotionPlugin;

	Ncommand: Command[] = [];

	constructor(plugin: ObsidianSyncNotionPlugin) {
		this.plugin = plugin;

		// Check if NextButton is true, then include the corresponding command
		if (this.plugin.settings.NextButton) {
			this.Ncommand.push({
				id: "share-to-notionnext",
				name: i18nConfig.CommandName, // Use the translated text from i18nConfig
				editorCallback: async (editor: Editor, view: MarkdownView) => {
					await uploadCommandNext(this.plugin, this.plugin.settings, this.plugin.app);
				}
			});
		}

		// Check if GeneralButton is true, then include the corresponding command
		if (this.plugin.settings.GeneralButton) {
			this.Ncommand.push({
				id: "share-to-notion",
				name: i18nConfig.CommandNameGeneral, // Use the translated text from i18nConfig
				editorCallback: async (editor: Editor, view: MarkdownView) => {
					await uploadCommandGeneral(this.plugin, this.plugin.settings, this.plugin.app);
				}
			});
		}

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

	async ribbonDisplay() {
		const NcommandList: DatabaseList[] = [];

		this.Ncommand.map(command => NcommandList.push(
			{
				name: command.name,
				match: command.editorCallback
			}
		)
		);

		const fusg = new FuzzySuggester(this.plugin);

		fusg.setSuggesterData(NcommandList);
		await fusg.display(async (results) => { await results.match() })
	};

	// if the setting has been changed, try to rebuild the command list
	async updateCommand() {

		this.Ncommand = [];

		if (this.plugin.settings.NextButton) {
			this.Ncommand.push({
				id: "share-to-notionnext",
				name: i18nConfig.CommandName, // Use the translated text from i18nConfig
				editorCallback: async (editor: Editor, view: MarkdownView) => {
					await uploadCommandNext(this.plugin, this.plugin.settings, this.plugin.app);
				}
			});
		}

		if (this.plugin.settings.GeneralButton) {
			this.Ncommand.push({
				id: "share-to-notion",
				name: i18nConfig.CommandNameGeneral, // Use the translated text from i18nConfig
				editorCallback: async (editor: Editor, view: MarkdownView) => {
					await uploadCommandGeneral(this.plugin, this.plugin.settings, this.plugin.app);
				}
			});
		}

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
