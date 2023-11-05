export const I18n: { [key: string]: any } = {
    en: {
        ribbonIcon: "Share to NotionNext",
        GeneralSetting: "General information Settings",
        CommandID: "share-to-notionnext",
        CommandName: "Share to NotionNext Database",
        CommandIDGeneral: "share-to-notion",
        CommandNameGeneral: "Share to Notion General Database",
        NotionNextVersion: "NotionNext Version Database",
        NotionNextVersionDesc:
            "Turn on this option if you are using NotionNext",
        NotionNextSettingHeader: "NotionNext Database Settings",
        NotionAPI: "Notion API Token",
        NotionAPIDesc: "It's a secret",
        NotionAPIText: "Enter your Notion API Token",
        DatabaseID: "Database ID",
        DatabaseIDText: "Enter your Database ID",
        BannerUrl: "Banner url(optional)",
        BannerUrlDesc:
            "page banner url(optional), default is empty, if you want to show a banner, please enter the url(like:https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/ae7a9ac6cf427f3ca338a409ce6967ced9506f12/doc/2.png)",
        BannerUrlText: "Enter your banner url",
        NotionUser: "Notion ID(username, optional)",
        NotionUserDesc:
            "Your notion ID (optional),share link likes:https://username.notion.site/,your notion id is [username]",
        NotionUserText: "Enter your notion ID (options)",
        NotionGeneralSettingHeader: "General Notion Database Settings",
        NotYetFinish:
            "Not finished. This function will be available in the next version",
        PlaceHolder: "Enter database Name",
        "notion-logo": "Share to NotionNext",
        "sync-success": "Sync to NotionNext success: \n",
        "sync-fail": "Sync to NotionNext fail: \n",
        "open-notion": "Please open the file that needs to be synchronized",
        "config-secrets-notion-api":
            "Please set up the notion API in the settings tab.",
        "config-secrets-database-id":
            "Please set up the database id in the settings tab.",
        "set-tags-fail":
            "Set tags fail,please check the frontmatter of the file or close the tag switch in the settings tab.",
        NNonMissing:
            "The 'NNon' property is missing in the settings. Please set it up.",
        "set-api-id":
            "Please set up the notion API and database ID in the settings tab.",
    },
    zh: {
        ribbonIcon: "分享到 NotionNext",
        GeneralSetting: "通用信息设置",
        CommandID: "share-to-notionnext",
        CommandName: "分享到 NotionNext",
        CommandIDGeneral: "share-to-notion",
        CommandNameGeneral: "分享到 Notion 普通数据库",
        NotionNextVersion: "NotionNext 版本数据库",
        NotionNextVersionDesc: "如果你使用的是NotionNext，请打开此选项",
        NotionNextSettingHeader: "NotionNext 数据库参数设置",
        NotionAPI: "Notion API 令牌",
        NotionAPIDesc: "显示为密码",
        NotionAPIText: "输入你的 Notion API 令牌",
        DatabaseID: "数据库 ID",
        DatabaseIDText: "输入你的数据库 ID",
        BannerUrl: "封面图片地址（可选）",
        BannerUrlDesc:
            "页面封面图片地址（可选），默认为空，如果你想显示封面图片，请输入图片地址（例如：https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/ae7a9ac6cf427f3ca338a409ce6967ced9506f12/doc/2.png）",
        BannerUrlText: "输入你的封面图片地址",
        NotionUser: "Notion ID（用户名，可选）",
        NotionUserDesc:
            "你的 Notion ID（可选），分享链接类似：https://username.notion.site/，你的 Notion ID 是 [username]",
        NotionUserText: "输入你的 Notion ID（可选）",
        NotionGeneralSettingHeader: "普通 Notion 数据库设置",
        NotYetFinish: "未完成。此功能将在之后版本中提供",
        PlaceHolder: "输入数据库名称",
        "notion-logo": "分享到NotionNext",
        "sync-success": "同步到NotionNext成功:\n",
        "sync-fail": "同步到NotionNext失败: \n",
        "open-file": "请打开需要同步的文件",
        "config-secrets-notion-api": "请在插件设置中添加notion API",
        "config-secrets-database-id": "请在插件设置中添加database id",
        "set-tags-fail":
            "设置标签失败,请检查文件的frontmatter,或者在插件设置中关闭设置tags开关",
        NNonMissing: "未设置'NNon'属性，请在插件设置中选择NotionNext数据库。",
        "set-api-id": "请在插件设置中设置notion API和database ID",
    },
};

export const I18nConfig = (lang: any): any => {
    return I18n[lang];
};

export const i18nConfig = I18nConfig(
    window.localStorage.getItem("language") || "en",
); // Export i18nConfig
