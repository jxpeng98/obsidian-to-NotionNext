# Obsidian to NotionNext

[![Test](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml)
[![Release](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22share-to-notionnext%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/)
[![GitHub release (with filter)](https://img.shields.io/github/package-json/v/jxpeng98/obsidian-to-NotionNext)](https://github.com/jxpeng98/obsidian-to-NotionNext/releases/)

[//]: # ([![Github all releases]&#40;https://img.shields.io/github/downloads/jxpeng98/obsidian-to-NotionNext/total.svg&#41;]&#40;https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/&#41;)


[//]: # ([中文文档]&#40;README-zh.md&#41;)

**Now, support both NotionNext and General databases with customised properties.**

**现在支持NotionNext和普通Notion数据库，可自定义数据库列表。**

## TODO List

- [x] ~~Modify the Edit function for the custom properties. 改进自定义属性的编辑功能~~
- [ ] Support group upload with one click 支持一键多数据库上传
- [x] ~~Support custom properties for Notion General database. 支持自定义属性~~
- [x] ~~Support preview for database details in plugin settings. 支持预览数据库详情~~
- [x] ~~Support edit for database details in plugin settings. 支持编辑数据库详情~~

## Precautions
### For customised database users
**⚠️⚠️⚠️: The exist customised database should be recreated if you want to update to version 2.3.0. The new version has a new database structure, and the old database structure is not compatible with the new version to build the index properly.**

### 自定义数据库用户
**⚠️⚠️⚠️: 如果你想要更新到2.3.0版本，你需要重新创建自定义数据库。新版本有一个新的数据库结构，旧的数据库结构无法构建索引。**

## How to use
You need seven steps to use this plugin in your Obsidian.
1. Create a database in your Notion workspace.
Open Notion, clink the `+` button on the left side, and 'Add a page' -> select 'Table' -> 'New database'.
2. On the right-top corner, click the 'Share' -> 'Publish' -> 'Publish' -> copy the database id from the URL.
3. go to [Notion API](https://www.notion.com/my-integrations) to create a new integration, and copy the token.
4. Go back to your created Notion database, click the right-top '...' -> connections -> connect to -> find the integration you created and connect it.
5. Go to obsidian settings -> community plugins -> search 'NotionNext' -> install it.
6. Create a database in the plugin settings, and fill in the database details and all properties you want to sync (**Note: the name of the properties is case-sensitive.**).
   - There are three type of database that you can use:
	 - NotionNext: the database for the NotionNext template.(**All the properties are in lowercase**)
	 - General: the database for the general Notion database (**Only have `title` and `tags` columns**)
	 - Custom: the database for the custom properties (You can customise the properties you want to sync)
7. Create a new note in Obsidian, and fill in the frontmatter with the properties you want to sync.

## 使用方法
如果你想使用这个插件，你需要完成下边的七个步骤。
1. 首先在你的Notion中创建一个数据库。
2. 点击右上角的'分享' -> '发布' -> '发布' -> 然后复制URL中的数据库ID。(版本不同，可能id的形式也不同。只需要复制在？之前的纯数字部分应该就可以了)
3. 去[Notion API](https://www.notion.com/my-integrations)创建一个新的API，然后复制token。
4. 回到你创建的Notion数据库，点击右上角的'...' -> 连接 -> 连接到 -> 把你刚才创建的API绑定到你的数据库
5. 回到Obsidian的设置 -> 社区插件 -> 搜索'NotionNext' -> 安装
6. 在插件设置中创建一个数据库，然后填写数据库的详情和你想要同步的属性 (**注意：Notion会识别表头的大小写，一定要和notion中的表头保持大小写一致**)。
   - 你可以使用三种类型的数据库：
	 - NotionNext: 用于NotionNext模板的数据库。(**默认全部小写**)
	 - General: 用于普通的Notion数据库（**只有`title`和`tags`两个属性**）
	 - Custom: 用于自定义属性的数据库（你可以自定义你想要同步的属性）
7. 在Obsidian中创建一个新的笔记，然后在frontmatter中写入你想要的属性。

## Example
```plain
---
# default value has been set.
# for any unwanted value, you can delete it or set it to empty.
# for example, if you donot want to set password, you can delete password: "1234" or set it to password: ""
# 我已经在插件中设置了默认值，如果有不需要的选项，可以直接删除。
# 例如你不需要密码选项，你可以将password: "1234"删除，或者将它设置为空。
# !!!!!!!!!!!!
# 现在阶段一定不要修改表头的名字， please do not change the name of the header in YAML front matter 
# !!!!!!!!!!!!
titleicon: 📎 # emoji icon, default is 📜， 默认是📜
date: 2023-07-23 # default is today， 默认是今天。 Format is YYYY-MM-DD， 格式是YYYY-MM-DD
coverurl: https://img.jxpeng.dev/2023/08/843e27a210847f05a0f7cfb121fec100.jpg # default is empty， 默认是空
type: Post # Post or Page, default is Post， 默认是Post
slug: test # slug for url, default is empty， 默认是空
status: Draft # Draft, Invisible, Published, default is Draft， 默认是Draft 
category: test # default is 'Obsidian'， 默认是'Obsidian'
summary: this is a summary for test post # default is empty， 默认是空
icon: fa-solid fa-camera # you can ignore this, default is empty， 默认是空，可直接删除
password: "1234" # if you donot want to set password, you can delete this line, default is empty， 默认是空，可直接删除
# 现在必须开启tags选项，否则会报错
tags:
  - test  # tags for post
  - web # add more tags if you want
---
```

![](https://minioapi.pjx.ac.cn/img1/2024/07/7a1550aefd71175c981077ce46d03c87.png)
- Once you create the properties, you can preview the database details in the plugin settings.
![](https://minioapi.pjx.ac.cn/img1/2024/07/9599d77116afad065d2e31129942acc7.png)

---

## Acknowledgement

Thanks to the [original author](https://github.com/EasyChris/obsidian-to-notion) for developing such a useful plugin that can synchronize Obsidian to Notion. However, the original repository can only sync Name and Tag information. For those like me who use [NotionNext](https://github.com/tangly1024/NotionNext) to set up their website, this presents some limitations. Every time I import, I need to make a lot of modifications.

Thus, based on the [original author's work](https://github.com/EasyChris/obsidian-to-notion), I've added a feature to match the [NotionNext](https://github.com/tangly1024/NotionNext) template. This way, you can edit directly in Obsidian and publish with a single click after organizing.

---

<details> <summary> Previous How to Use </summary>

### Precautions

For now, this plugin is exclusively for [NotionNext](https://github.com/tangly1024/NotionNext). If you're not using this template, you'll keep receiving `error 400`.

For those without a NotionNext requirement, please use the original [Obsidian-to-notion](https://github.com/EasyChris/obsidian-to-notion).

### Pre-Installation Steps

Before installing the plugin, you must have set up the following:

1. Your NotionNext database.
2. According to the original author's readme.md, set up the Notion API, and it should already be associated with your NotionNext repository.
3. NotionNext Database ID
4. Your NotionNext database should have the following contents:
    - type
    - title
    - slug
    - category
    - tags
    - date
    - status
    - summary
    - password
    - icon

From version 0.0.6, I also add the following contents:
 - titleicon: the unique icon for each post, it can only support emoji currently.
 - cover url: the cover image for each post, it should be end with a type of image, such as .jpg, .png, .gif, etc.

**If you've directly copied the NotionNext template, these contents should already exist. I've made changes to this plugin based on the original author's work. All you need to ensure is that your database has the above content, and every letter is in lowercase!!!**

**⚠️⚠️⚠️: All headers are in lowercase!!! The order doesn't matter!**

### Plugin Installation

#### Install via Community Plugins

Open `Obsidian settings -> Community Plugins -> Browse -> NotionNext -> Share to NotionNext`

#### Mannually Install

1. Close Obsidian.
2. Download the plugin file from Release and unzip it into your Obsidian plugin directory.
3. Re-open Obsidian, go to settings, and enable the plugin.
4. In the settings, find Obsidian to NotionNext, and enter your NotionNext Database ID and API token.

### How to Use

### Using the Plugin

In the repository, I have uploaded a template which you can directly copy into your template folder. After that, use Obsidian's template feature to create a new note with one click.

If you don't want to use the template, you can also directly create a new file in Obsidian and then copy the content below. Then save it.

```markdown
---
# default value has been set.
# for any unwanted value, you can delete it or set it to empty.
# for example, if you donot want to set password, you can delete password: "1234" or set it to password: ""
# 我已经在插件中设置了默认值，如果有不需要的选项，可以直接删除。
# 例如你不需要密码选项，你可以将password: "1234"删除，或者将它设置为空。
# !!!!!!!!!!!!
# 现在阶段一定不要修改表头的名字， please do not change the name of the header in YAML front matter
# !!!!!!!!!!!!
titleicon: 📎 # emoji icon, default is 📜， 默认是📜
date: 2023-07-23 # default is today， 默认是今天。 Format is YYYY-MM-DD， 格式是YYYY-MM-DD
coverurl: https://img.jxpeng.dev/2023/08/843e27a210847f05a0f7cfb121fec100.jpg # default is empty， 默认是空
type: Post # Post or Page, default is Post， 默认是Post
slug: test # slug for url, default is empty， 默认是空
stats: Draft # Draft, Invisible, Published, default is Draft， 默认是Draft 
category: test # default is 'Obsidian'， 默认是'Obsidian'
summary: this is a summary for test post # default is empty， 默认是空
icon: fa-solid fa-camera # you can ignore this, default is empty， 默认是空，可直接删除
password: "1234" # if you donot want to set password, you can delete this line, default is empty， 默认是空，可直接删除
# 现在必须开启tags选项，否则会报错
tags:
  - test  # tags for post
  - web # add more tags if you want
---

Contents Below

```

Usage of the template is as follows:
![](https://minioapi.pjx.ac.cn/img1/2023/09/354b950e5777b48832c2475e4a31f2cc.gif)

**Plugin preview is shown below**
![](https://minioapi.pjx.ac.cn/img1/2023/09/d6199619b68fab218fca8ae0cebece78.gif)

</details>

---

<details> <summary> Original README.md </summary>

Many Thanks for the original author's work. I've only made some changes to the original author's work. If you find this plugin useful, please give the [original author](https://github.com/EasyChris/obsidian-to-notion) a star.

# Obsidian to Notion

[![](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/CI.yml)
[![Release Obsidian plugin](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml/badge.svg)](https://github.com/Easychris/obsidian-to-notion/actions/workflows/release.yml)
[![GitHub license](https://img.shields.io/github/license/EasyChris/obsidian-to-notion)](https://raw.githubusercontent.com/EasyChris/obsidian-to-notion/master/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/Easychris/obsidian-to-notion/total.svg)](https://GitHub.com/Easychris/obsidian-to-notion/releases/)
[![GitLab latest release](https://badgen.net/github/release/Easychris/obsidian-to-notion/)](https://github.com/Easychris/obsidian-to-notion/releases)

Share of obsidian to Notion [中文文档](README-zh.md)

Sharing files from Obsidian to Notion with a single click, and Obsidian will automatically add the Notion share link

You are welcome to offer it a star if it can benefit you.

![](./doc/1.gif)

# TODO

### [TODO Board](https://github.com/users/EasyChris/projects/3/views/1)

- [x] support for custom page banner
- [x] update the exsit page
- [x] support for mult language
- [x] support for auto copy the share link to clipboard
- [x] support for mobile
- [x] support tags thank for [@jannikbuscha](https://github.com/jannikbuscha)
- [ ] transfer the bi-link format like [[]] into the format that Notion supports.

# How to use

## Install the plugin

### Marketplace download

Open obsidian setting -> Add plugin -> Search -> notion

![](https://afox-1256168983.cos.ap-shanghai.myqcloud.com/20220628214145.png)

### BRAT

Enter `BRAT` into the plugin market center to find it.
Add `EasyChris/obsidian-to-notion` to the list of BRAT plugins that have been installed.
Return to the plugin center and turn it on.

### Manual installation

```
cd YOUR_OBSIDIAN_FOLDER/.obsidian/plugins/
git clone https://github.com/EasyChris/obsidian-to-notion.git
```

## Apply Notion API

Official reference documentation: [https://developers.notion.com/docs](https://developers.notion.com/docs)

### Step 1: Create integration

Go to [https://www.notion.com/my-integrations](https://www.notion.com/my-integrations)
Once created, copy `secrets toekn`
![](https://files.readme.io/2ec137d-093ad49-create-integration.gif)

#### Note

database first custom name must be "Name", otherwise sync to notion will be failed

![](https://afox-1256168983.cos.ap-shanghai.myqcloud.com/20220618102029.png)

### Step 2: Share a database with your integration

Create a new page (with public permissions)
Create a new database in the page -> you need `full page database`
![](./doc/3.gif)

Add `integration` to your new database

![](./doc/6.gif)

### Step 3: Copy the database ID

```
https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...
                                  | --------- Database ID --------|

```

## Open the plugin configuration

Fill the configuration with the `NOTION_API_KEY` and `DATABASE_ID` you got
![](./doc/2.png)

## Upload file content to notion

Click the uploadCommand notion button
![](./doc/4.png)
A share link will be automatically generated after successful uploadCommand
![](./doc/5.png)

## Banner URL [option]

Banner url must be a image url like: <https://i.imgur.com/xxx.jpg>
If you don't want to use banner, leave it blank

## Convert Tags [option]

Transfer the Obsidian tags to the Notion table.
It requires the column with the name 'Tags'.
![](./doc/7.png)

Add tags to your notion page

![](./doc/10.png)

- open plugin convert tags

![](./doc/8.png)

- add tags in the head

```markdown
---
tags: [tag1,tag2]
---

this is test tags

```

```markdown
---
tags:
  - tag4
---

this is test tags

```

![](./doc/9.png)

Thanks for [@jannikbuscha](https://github.com/jannikbuscha) contribution

## Notion ID [option]

Notion ID is the your notion site ID that you want to share the file to.
if you don't write it, notion will share to the default link like:
<https://www.notion.so/myworkspace/a8aec43384f447ed84390>
that visit this page need to redirect to your site url
if you write the Notion ID, it will share to the page link like:
<https://your_user_name.notion.site/myworkspace/a8aec43384f447ed84390>.
The visiter don't need to redirect url.

## Sync image to Notion

To sync images to your oss or cos bucket, use the [Obsidian Image Auto Upload Plugin](https://github.com/renmu123/obsidian-image-auto-upload-plugin).

# Development

```
git clone https://github.com/EasyChris/obsidian-to-notion.git
yarn install
yarn dev
```

## Release

```
node update-version.js
./release.sh
```


# Thanks
[Development Process | Obsidian Plugin Development Documentation](https://luhaifeng666.github.io/obsidian-plugin-docs-zh/zh/getting-started/development-workflow.html)

[GitHub - devbean/obsidian-wordpress: An obsidian plugin for publishing docs to WordPress.](https://github.com/devbean/obsidian-wordpress)

[GitHub - obsidianmd/obsidian-api](https://github.com/obsidianmd/obsidian-api)

[GitHub - Easychris/obsidian-to-notion: Obsidian Weread Plugin is an plugin to sync Weread(微信读书) hightlights and annotations into your Obsidian Vault.](https://github.dev/zhaohongxuan/obsidian-weread-plugin)

[GitHub - Quorafind/Obsidian-Memos: A quick capture plugin for Obsidian, all data from your notes.](https://github.com/Quorafind/Obsidian-Memos)

[https://github.com/jannikbuscha/obsidian-to-notion](https://github.com/jannikbuscha)

# License
GNU GPLv3


</details>
