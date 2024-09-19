import {en} from "./locale/en";
import {zh} from "./locale/zh";
import {ja} from "./locale/ja";

export const I18n: {[key: string]:any} = {
	en,
	zh,
	ja,
};

class I18nManager {
	private currentLanguage: string;

	constructor() {
		this.currentLanguage = this.detectLanguage();
	}

	// return the language to use
	private detectLanguage(): string {
		const storedLanguage = window.localStorage.getItem("language");
		if (storedLanguage && this.isLanguageSupported(storedLanguage)) {
			console.log(`Using stored language: ${storedLanguage}`);
			return storedLanguage;
		}

		const browserLanguage = window.navigator.language.split("-")[0];
		if (this.isLanguageSupported(browserLanguage)) {
			console.log(`Using browser language: ${browserLanguage}`);
			return browserLanguage;
		}

		// Default to English if no match is found
		console.log("Using default language: en");
		return "en";
	}

	private isLanguageSupported(lang: string): boolean {
		return Object.prototype.hasOwnProperty.call(I18n, lang);
	}

	// Get the i18n configuration for the current language
	public getConfig(): any {
		return I18n[this.currentLanguage];
	}
}

export const i18nManager = new I18nManager();

export const i18nConfig = i18nManager.getConfig();
