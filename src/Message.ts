export const NoticeMsg: { [key: string]: any } = {
	"en": {
		"notion-logo": "Share to NotionNext",
		"sync-success": "Sync to NotionNext success: \n",
		"sync-fail": "Sync to NotionNext fail: \n",
		"open-notion": "Please open the file that needs to be synchronized",
		"config-secrets-notion-api": "Please set up the notion API in the settings tab.",
		"config-secrets-database-id": "Please set up the database id in the settings tab.",
		"set-tags-fail": "Set tags fail,please check the frontmatter of the file or close the tag switch in the settings tab.",
		"NNonMissing": "The 'NNon' property is missing in the settings. Please set it up.",
		"set-api-id": "Please set up the notion API and database ID in the settings tab."
	},
	"zh": {
		"notion-logo": "分享到NotionNext",
		"sync-success": "同步到NotionNext成功:\n",
		"sync-fail": "同步到NotionNext失败: \n",
		"open-file": "请打开需要同步的文件",
		"config-secrets-notion-api": "请在插件设置中添加notion API",
		"config-secrets-database-id": "请在插件设置中添加database id",
		"set-tags-fail": "设置标签失败,请检查文件的frontmatter,或者在插件设置中关闭设置tags开关",
		"NNonMissing": "未设置'NNon'属性，请在插件设置中选择NotionNext数据库。",
		"set-api-id": "请在插件设置中设置notion API和database ID"
	},
}


export const NoticeMConfig = (lang: any): any => {
	return NoticeMsg[lang]
}
