import {en} from "./en";
import {zh} from "./zh";

export const I18n: { [key: string]: any } = {
	en,
	zh,
};

export const I18nConfig = (lang: any): any => {
    return I18n[lang];
};

export const i18nConfig = I18nConfig(
    window.localStorage.getItem("language") || "en",
); // Export i18nConfig
