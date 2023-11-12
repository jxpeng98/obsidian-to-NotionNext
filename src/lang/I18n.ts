export const I18n: { [key: string]: any } = {
    en: {
        ribbonIcon: "Share to NotionNext",
        GeneralSetting: "General information Settings",
        CommandID: "share-to-notionnext",
        CommandName: "Share to NotionNext Database",
        CommandIDGeneral: "share-to-notion",
        CommandNameGeneral: "Share to Notion General Database",
        NotionNextButton: "NotionNext command switch",
        NotionNextButtonDesc: "Open this option, Sync to NotionNext command will be displayed in the command palette",
        NotionNextSettingHeader: "NotionNext Database Settings",
        NotionAPI: "Notion API Token",
        NotionAPIDesc: "It's a secret",
        NotionAPIText: "Enter your Notion API Token",
        DatabaseID: "Database ID",
        DatabaseIDText: "Enter your Database ID",
        BannerUrl: "Banner url(optional)",
        BannerUrlDesc:
            "Default is empty, if you want to show a banner, please enter the url(like: https://minioapi.pjx.ac.cn/img1/2023/11/b7b40a0724e93b7d7ab494bb3b8a2da8.png)",
        BannerUrlText: "Enter your banner url",
        NotionUser: "Notion ID(username, optional)",
        NotionUserDesc:
            "Your notion ID (optional),share link likes:https://username.notion.site/,your notion id is [username]",
        NotionUserText: "Enter your notion ID",
        NotionGeneralSettingHeader: "General Notion Database Settings",
        NotionGeneralButton: "Notion General command switch",
		NotionGeneralButtonDesc: "Open this option, Sync to Notion General Database command will be displayed in the command palette",
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
		NotionCustomSettingHeader: "Notion Custom Database Settings",
		NotionCustomButton: "Notion Customised command switch",
		NotionCustomButtonDesc: "Open this option, Sync to Notion Customised Database command will be displayed in the command palette",
    },
    zh: {
        ribbonIcon: "分享到 NotionNext",
        GeneralSetting: "通用信息设置",
        CommandID: "share-to-notionnext",
        CommandName: "分享到 NotionNext",
        CommandIDGeneral: "share-to-notion",
        CommandNameGeneral: "分享到 Notion 普通数据库",
		NotionNextButton: "NotionNext 同步命令开关",
		NotionNextButtonDesc: "打开此选项，NotionNext 同步将显示在命令面板中",
        NotionNextSettingHeader: "NotionNext 数据库参数设置",
        NotionAPI: "Notion API 令牌",
        NotionAPIDesc: "显示为密码",
        NotionAPIText: "输入你的 Notion API 令牌",
        DatabaseID: "数据库 ID",
        DatabaseIDText: "输入你的数据库 ID",
        BannerUrl: "封面图片地址（可选）",
        BannerUrlDesc:
            "默认为空，如果你想显示封面图片，请输入图片地址（例如：https://minioapi.pjx.ac.cn/img1/2023/11/b7b40a0724e93b7d7ab494bb3b8a2da8.png）",
        BannerUrlText: "输入你的封面图片地址",
        NotionUser: "Notion ID（用户名，可选）",
        NotionUserDesc:
            "你的 Notion ID（可选），分享链接类似：https://username.notion.site/，你的 Notion ID 是 [username]",
        NotionUserText: "输入你的 Notion ID",
        NotionGeneralSettingHeader: "普通 Notion 数据库设置",
		NotionGeneralButton: "普通数据库同步命令开关",
		NotionGeneralButtonDesc: "打开此选项，同步到普通数据库命令将显示在命令面板中",
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
		NotionCustomSettingHeader: "Notion 自定义数据库设置",
		NotionCustomButton: "Notion 自定义数据库同步命令开关",
		NotionCustomButtonDesc: "打开此选项，同步到自定义数据库命令将显示在命令面板中",
    },
};

export const I18nConfig = (lang: any): any => {
    return I18n[lang];
};

export const i18nConfig = I18nConfig(
    window.localStorage.getItem("language") || "en",
); // Export i18nConfig
