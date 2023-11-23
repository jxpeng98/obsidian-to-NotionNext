import {en} from "./locale/en";
import {zh} from "./locale/zh";
import {ja} from "./locale/ja";

export const I18n: {[key: string]:any} = {
	en,
	zh,
	ja,
};

export const I18nConfig = (lang: string): any => {
    return I18n[lang];
};

const storedLanguage = window.localStorage.getItem("language");

export const i18nConfig = I18n[storedLanguage || window.navigator.language.split('-')[0] || "en"];
