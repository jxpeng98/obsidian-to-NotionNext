import { FuzzySuggestModal, FuzzyMatch } from 'obsidian';
import MyPlugin from "../main";
import { i18nConfig } from "../lang/I18n";

/**
 * Simple interface for what should be displayed and stored for suggester
 */
export interface DatabaseList {
    name: string,        // specific database name
    match: any               //
}


export class FuzzySuggester extends FuzzySuggestModal<DatabaseList> {
    private plugin: MyPlugin;
    private data: DatabaseList[];
    private callback: any;

    constructor(plugin: MyPlugin) {
        super(plugin.app);
        this.plugin = plugin;
        this.setPlaceholder(i18nConfig.PlaceHolder);
    }

    setSuggesterData(suggesterData: Array<DatabaseList>): void { this.data = suggesterData }

    async display(callBack: (item: DatabaseList, evt: MouseEvent | KeyboardEvent) => void): Promise<any> {
        this.callback = callBack;
        this.open();
    }

    // Store the data
    getItems(): DatabaseList[] {
        return this.data
    }

    getItemText(item: DatabaseList): string {
        return item.name
    }

    onChooseItem(item: DatabaseList, evt: MouseEvent | KeyboardEvent): void { }

    onChooseSuggestion(item: FuzzyMatch<DatabaseList>, evt: MouseEvent | KeyboardEvent): void {
        this.callback(item.item, evt)
    }

    renderSuggestion(item: FuzzyMatch<DatabaseList>, el: HTMLElement): void {
        el.createEl('div', { text: item.item.name })
    }

}
