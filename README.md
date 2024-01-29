# Obsidian to NotionNext

[![Test](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml)
[![Release](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22share-to-notionnext%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/)
[![GitHub release (with filter)](https://img.shields.io/github/v/release/jxpeng98/obsidian-to-NotionNext)](https://github.com/jxpeng98/obsidian-to-NotionNext/releases/)

[//]: # ([![Github all releases]&#40;https://img.shields.io/github/downloads/jxpeng98/obsidian-to-NotionNext/total.svg&#41;]&#40;https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/&#41;)

[中文文档](README-zh.md)

**Now, support both NotionNext and General databases with customised properties.**

**现在支持NotionNext和普通Notion数据库，可自定义数据库列表。**

## TODO List

- [x] Support custom properties for Notion General database. 支持自定义属性
- [ ] Support group upload with one click 支持一键多数据库上传
- [x] Support preview for database details in plugin settings. 支持预览数据库详情
- [x] Support edit for database details in plugin settings. 支持编辑数据库详情

## Update

### 2.2.0 (Big Update)

- add the support for custom properties in the Notion General database. 支持自定义属性
	- [x] `title`, which is the first column of the database
	- [x] 'Text'
	- [x] 'Number'
	- [x] 'Date'
	- [x] 'Checkbox'
	- [x] 'Select'
	- [x] 'Multi-select'
	- [x] 'URL'
	- [x] 'Email'
	- [x] 'Phone'
	- [x] 'File' (**Only support external embedded files**)

![](https://minioapi.pjx.ac.cn/img1/2024/01/0cd99007409feede77bf5a3291e88af3.png)
- Once you create the properties, you can preview the database details in the plugin settings.
![](https://minioapi.pjx.ac.cn/img1/2024/01/665139962cc4cee2a0cb576b508b29f2.png)

---

Thanks to the [original author](https://github.com/EasyChris/obsidian-to-notion) for developing such a useful plugin that can synchronize Obsidian to Notion. However, the original repository can only sync Name and Tag information. For those like me who use [NotionNext](https://github.com/tangly1024/NotionNext) to set up their website, this presents some limitations. Every time I import, I need to make a lot of modifications.

Thus, based on the [original author's work](https://github.com/EasyChris/obsidian-to-notion), I've added a feature to match the [NotionNext](https://github.com/tangly1024/NotionNext) template. This way, you can edit directly in Obsidian and publish with a single click after organizing.

---

## Archive Update
### 2.1.0

- add confirmation interface for deleting a database 增加删除数据库的确认界面
- fix the typo in the edit database modal 修复编辑数据库界面的标题错误
- improve the logic for the database editing 改进数据库编辑界面的逻辑

### 2.0.1

- Add the preview and edit function for database details in the plugin settings. 增加插件设置中数据库详情的预览和编辑功能。
![](https://minioapi.pjx.ac.cn/img1/2024/01/952f1e579daeac35b257ff7d744b0a3d.png)
  - Preview:
  ![](https://minioapi.pjx.ac.cn/img1/2024/01/952f1e579daeac35b257ff7d744b0a3d.png)

  - Edit:
	![](https://minioapi.pjx.ac.cn/img1/2024/01/ded3d62660f5488c76488304a3fb269e.png)
  
### 2.0.0 (Big Update)

- redesign the plugin settings UI. From this version, the settings UI will be separated into two parts: 
  - one for general settings: bannerUrl and your notion username (ID)
  - one for database list: You can add new database or delete the database.
- 重新设计了插件设置界面。从这个版本开始，设置界面将被分成两部分：
  - 一部分是通用设置：bannerUrl和你的notion用户名（ID）
  - 一部分是数据库列表：你可以添加新的数据库或者删除数据库。

![](https://minioapi.pjx.ac.cn/img1/2023/12/f7e89241f45cfee6b902ec4b69dd6f63.png)

- You can add more databases in the plugin settings.
- 你可以在插件设置中添加更多的数据库。

![](https://minioapi.pjx.ac.cn/img1/2023/12/023bf46ebbc92c3991d2c443c575bc80.gif)

- You can sync one note to multiple databases.
- 你可以将一个笔记同步到多个数据库中。

![](https://minioapi.pjx.ac.cn/img1/2023/12/75f793bad756162e46bf41e54166eb32.png)

**Note: You need to add your previous database in the new template.**
**注意：你需要将之前的数据库添加到新的模板中。**

### 1.1.2
- Fix the typo that you cannot sync the markdown file `status` in the frontmatter to NotionNext. You can use `stats` or `status` to sync the status of the post to NotionNext. This update will not affect the function of syncing to General database. 
- 修复了一个拼写错误，导致无法同步`status`到NotionNext。现在你可以使用`stats`或者`status`来同步文章的状态到NotionNext。这个更新不会影响到同步到General数据库的功能。
- **Both `stats` and `status` will work, but you can only use one of them.**
- **`stats`和`status`都可以使用，但是你只能使用其中一个。**

For example, 
```yaml
stats: Draft # Draft, Invisible, Published, default is Draft， 默认是Draft
# or 
status: Draft # Draft, Invisible, Published, default is Draft， 默认是Draft
# both of them will work, but you can only use one of them.
```

### 1.1.1
- Fix the setting display bug in Japanese.
- Add Japanese translation.

### 1.1.0
- Fix the custom name setting tab display bug. 
- Add a toggle to control whether to sync `tags` since the empty tags may cause the syncing error.

If you switch off the `tags` function in the plugin settings, it will ignore the `tags` in your frontmatter. 

If you prefer to sync tags to Notion database, you can switch on the `tags` function in the plugin settings. **You can only use the following format for tags:**

```yaml
tags: #empty tags, option 1
tags: [test,test1,test2] # use the square brackets, option 2
tags: 
  - test
  - test1
  - test2 # use the dash option 3
```

### 1.0.1

- Fix the custom name element display bug in the settings.

### 1.0.0 (Big Update)

- From this version, you can **modify the first column name (title column, default: 'title')** as you want. (**Note: You need to have the 'tags' column in your Notion General database, and add `tags:` in your markdown frontmatter. If not, you will receive `network error 400`. But you can leave the `tags:` blank.**)

![](https://minioapi.pjx.ac.cn/img1/2023/11/4a298b9be3990e9d2201bf2f50ca5a0a.png)
Like this:
![](https://minioapi.pjx.ac.cn/img1/2023/11/4cd8d79cd9dd9dde299e39c666cb3473.gif)

- Add a switch button to control whether display the setting tabs in the plugin settings for both NotionNext and Notion General databases.

![](https://minioapi.pjx.ac.cn/img1/2023/11/becb60fc44783842da4b3cf4c322f363.gif)

### 0.2.6

- Add a switch button to control whether to show the upload command in the command palette.

<!-- ![](https://minioapi.pjx.ac.cn/img1/2023/11/147c6a4eaa34da41a6f102558ed77106.png)
If you turn off the button for the General database, you won't see the option for the General database in the upload command list.

If you turn off the button for the NotionNext database, you won't see the option for the NotionNext database in the upload command list.

![](https://minioapi.pjx.ac.cn/img1/2023/11/70b8e4fc2148688ccbd6cfc53ce339a2.png) -->

### 0.2.3

- Fix the bug, now you can update normally.

### 0.2.2

- Support both NotionNext and General Notion database.
- You can have one NotionNext and one General Notion database.
- General Notion database can only have `title` and `tags` columns, and `tags` columns should be the multi-selected property. **the name of the columns is case sensitive. You should use small letter.**

![](https://minioapi.pjx.ac.cn/img1/2023/11/712a12081d855aa60f82a7b46913ab7e.gif)

![](https://minioapi.pjx.ac.cn/img1/2023/11/9de76cecceef74c78884ddfc1c221659.gif)

### 0.2.1

- Restructure the code

### 0.2.0

- From this version, the interactive logic has been rewritten. When you click the ribbon icon, it will display the sync command for all presetting NotionNext databases. You can choose the database you want to sync to. **However, only NotionNext database is supported for now.**

### 0.1.10

- Fix the Chinese support in the settings.

### 0.1.8

- Rebuild the uploadCommand function, and add one button to select the different databases. **However, only NotionNext database is supported for now.**  

### 0.1.7

- [x] Removed the `convert tag` option. Now, you can directly add tags in the YAML front matter. If you don't want to add tags, you can delete the tags in the YAML front matter or leave the tags blank.

## How to Use

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

---

**Original README.md**

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
