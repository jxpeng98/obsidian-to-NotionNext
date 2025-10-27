# Obsidian to NotionNext

[![Test](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/test.yml)
[![Release](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml/badge.svg)](https://github.com/jxpeng98/obsidian-to-NotionNext/actions/workflows/release.yml)
[![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22share-to-notionnext%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json)](https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/)
[![GitHub release (with filter)](https://img.shields.io/github/package-json/v/jxpeng98/obsidian-to-NotionNext)](https://github.com/jxpeng98/obsidian-to-NotionNext/releases/)

[//]: # ([![Github all releases]&#40;https://img.shields.io/github/downloads/jxpeng98/obsidian-to-NotionNext/total.svg&#41;]&#40;https://GitHub.com/jxpeng98/obsidian-to-NotionNext/releases/&#41;)

[//]: # ([中文文档]&#40;README-zh.md&#41;)

**Now, support All Notion databases, including NotionNext and General Notion databases, and customise the database list.**

**现在支持所有Notion数据库，包括NotionNext和一般Notion数据库，以及自定义数据库列表。**

## Precautions

### For customised database users before version 2.3.0

**⚠️⚠️⚠️: The existing customised database should be recreated if you want to update to version 2.3.0. The new version has a new database structure, and the old database structure is not compatible with the new version to build the index properly.**

### 在2.3.0版本之前的自定义数据库用户

**⚠️⚠️⚠️: 如果你想要更新到2.3.0版本，你需要重新创建自定义数据库。新版本有一个新的数据库结构，旧的数据库结构无法构建索引。**

## TODO List

- [x] Modify the Edit function for the custom properties. 改进自定义属性的编辑功能
- [x] Support sync with long notes (From `v2.4.0`). 从`v2.4.0`开始支持长笔记同步
- [x] Support custom properties for Notion General database. 支持自定义属性
- [x] Support preview for database details in plugin settings. 支持预览数据库详情
- [x] Support edit for database details in plugin settings. 支持编辑数据库详情
- [x] Convert Obsidian callouts into Notion callout blocks so your `[!info]` style notes stay consistent after syncing.
- [ ] Support group upload with one click 支持一键多数据库上传

## Callout support

Obsidian callouts written with the standard syntax (for example `> [!warning]` or `> [!quote]`) are automatically rendered as Notion callout blocks during upload. The plugin keeps the chosen callout type, title, and body content so your callout styling survives the trip from Obsidian to Notion without extra configuration.

```markdown
> [!info] Tips
> Remember to update your front matter before syncing.
```

After syncing, the note will contain an equivalent Notion callout block with the same icon and text.

## How to use

If you want to use this plugin, you need to follow the following steps to set up the plugin. The steps can be divided into two parts: setting up the Notion API and setting up the plugin in Obsidian.

### 1. Setting up the Notion API

1). Go to [Notion API](https://www.notion.com/my-integrations) to create a new integration, and **copy the token**.

![create-api](https://r2img.jxpeng.dev/2024/07/28526e416571f8b1fe70d90bd9975b81.gif)

2). Create a database in your Notion workspace.

Open Notion, click top-left `Create` a new page` -> You can give a title for the page and press "/" Select 'Database - Full page'.

![create-database](https://r2img.jxpeng.dev/2024/07/f1bd993ed667bcc980a45194eb647c34.gif)

Rename the database properties to `title` and `tags`.
**⚠️⚠️`title` is the title column! `tags` is lower case⚠️⚠️**

![rename-title-tags](https://r2img.jxpeng.dev/2024/07/20c7b81761195706dde6e7dae69edbc4.gif)

3). Add the Notion API integration.

Click the right-top '...' -> connections -> connect to -> find the integration you created and connect it.

![add-integration](https://r2img.jxpeng.dev/2024/07/bf59397146d96727c96dac06515c6c22.gif)

4). Publish the database to the public.
Click the 'Share' -> 'Publish' -> 'Publish' -> **copy the database id from the URL**.

![share-publish](https://r2img.jxpeng.dev/2024/07/5e5b9585cfa4a9086ef6704c3b48eacf.gif)

### 2. Setting up the plugin in Obsidian

1). Go to Obsidian settings -> community plugins -> search 'NotionNext' -> install it.
  ![plugin](https://r2img.jxpeng.dev/2024/07/1bf82618e943ec5eb68d89d4556bc3fc.png)

2). Open the plugin settings and create a new database.

![add-database](https://r2img.jxpeng.dev/2024/07/115f47b4180d04fb362b931f8092b5fb.png)

### 3. Create a database

**You can create three types of databases:**

#### 1️⃣ General database

General database is the default database, which only has the `title` and `tags` columns. **⚠️⚠️`title` and `tags` are lowercase⚠️⚠️**

![general](https://r2img.jxpeng.dev/2024/07/b2d0d0259afae7a542bd9f62256cd2c2.png)

The general is as follows:

- Full Name: the full name that you would like to give to the database.
- Abbreviate Name: the abbreviation that you would like to give to the database.
- Notion tags sync: whether you want to sync the tags column to Notion.
- Customise title property: whether you want to change the `title` to another name (e.g., `name`).
- Notion API token: the token you copied from the Notion API page.
- Notion Database ID: the database ID you copied from the Notion database URL. (e.g., only copy `7158cd3f70ce4f60afd9da5bdf74fd0c` between `site/` and `?`. `https://jxpeng.notion.site/7158cd3f70ce4f60afd9da5bdf74fd0c?v=380317ac5373sadasdas3c13e618f&pvs=4**`)

After setting, it should look like this:

![general-setting](https://r2img.jxpeng.dev/2024/07/3fc630171f6e8ae1011271b2b37d5d48.png)

Once you click `save`, the new database will be created in the plugin settings and display in the detabase list.

![database-list](https://r2img.jxpeng.dev/2024/07/3dff23b1c13a31f7696dc794fb78eba5.png)

#### 2️⃣ NotionNext database

If you use [NotionNext](https://github.com/tangly1024/NotionNext) to set up your website, you can use the NotionNext database. (**All the properties are in lowercase, and you do not need to change the properties**)

![notionnext](https://r2img.jxpeng.dev/2024/07/b164160ccfaf4fb23aa7ac1ce467e235.png)

Like the general database, you need to fill in the following information:

- Full Name: the full name that you would like to give to the database.
- Abbreviate Name: the abbreviation that you would like to give to the database.
- Notion API token: the token you copied from the Notion API page.
- Notion Database ID: the database ID you copied from the Notion database URL.

#### 3️⃣ Custom database

The custom database is purely customised, and you can customise the properties you want to sync. (**All the properties are in lowercase, and you do not need to change the properties**)

![customise](https://r2img.jxpeng.dev/2024/07/612b1377ec94d452abec7dc3fbe6cefb.png)

The basic information is identical to the general database and NotionNext database. You need to fill in the following information:

- Full Name: the full name that you would like to give to the database.
- Abbreviate Name: the abbreviation that you would like to give to the database.
- Notion API token: the token you copied from the Notion API page.
- Notion Database ID: the database ID you copied from the Notion database URL.

After adding the information, You can click `Add New Property` to add the properties you want to sync. There is no limit to the number of properties you can add.

![customise-add-property](https://r2img.jxpeng.dev/2024/07/17cfbfa93d92404ff70d920302f15981.png)

**⚠️⚠️⚠️**: **`Title column` is the main property in the Notion database, which has the open button to open the underlying page.** You can select the type of all other properties. **⚠️⚠️⚠️**

![title-column](https://r2img.jxpeng.dev/2024/07/0521b0aa6cedbe67bca4966bf79041ea.png)

According to the previously shown database, you can use `title` as the `Title column`, and `Tags` as the property 1.

![title-and-tags](https://r2img.jxpeng.dev/2024/07/87529214008147d3aa1bbe5868849f31.png)

**Until now, you have set up the plugin in Obsidian. You can start syncing your notes to Notion.**

### 4. Start syncing

Create a new note in Obsidian, and fill in the front matter with the properties you want to sync.

#### 1️⃣ note for general database

For example, we can create a test note with the following front matter:

``` markdown
---
title: test
tags: [test, web]
---

This is a test file. 

```

After creating the note, you can click the `Share to NotionNext` button on the left sidebar to sync the note to Notion.

![general-sync](https://r2img.jxpeng.dev/2024/07/6a690dc4b04d6b74134e9d3d76636c1b.gif)

#### 2️⃣ note for NotionNext database

We use the following front matter for the NotionNext database:

```markdown
---
title: test-notionnext
titleicon: 📎
date: 2023-07-23
coverurl: https://img.jxpeng.dev/2023/08/843e27a210847f05a0f7cfb121fec100.jpg
type: Post
slug: test
status: Draft
category: test
summary: this is a summary for test post
icon: fa-solid fa-camera
password: "1234"
tags:
  - test
  - web
NotionID-pengjiaxin: 8ba573de-8fdf-4681-b063-c39d26e7860e
---

this is a test file
```

![notionnext-sync](https://r2img.jxpeng.dev/2024/07/5539ec534e7a855ad87aa7949e5e836f.gif)

#### 3️⃣ note for custom database

##### sync title and tags

Use the previously created general database and rename `title` to `Name` and `tags` to `Tags` in Notion.

![rename-notion](https://r2img.jxpeng.dev/2024/07/e4d1c988be22353537998db897c7a471.gif)

The front matter for the custom database is as follows:

```markdown
---
Name: test-custom
Tags:
  - test
  - web
---

This is a test file. 
```

![sync-custom](https://r2img.jxpeng.dev/2024/07/973f17955cd921cca6b5007f0990eea4.gif)

##### sync more properties

Add more property to the custom database. For example, we can add a `summary` and `date` property to the custom database.

  1). Click `Edit` in the plugin settings.
  ![edit](https://r2img.jxpeng.dev/2024/07/f50639d8118b1f106d7bb29be5d3527b.png)
  2). Click `Add` and add the `summary` and `date` property.

![add-property](https://r2img.jxpeng.dev/2024/07/49716657adf0255a37fa214abf4716dc.gif)

  3). After adding the properties, you can see the properties in the plugin settings.
  ![four properties](https://r2img.jxpeng.dev/2024/07/63a0a0e09d537b1cf55cfdc49de4db1a.png)
  4). Add the `summary` and `date` in Notion

  ![add-in-notion](https://r2img.jxpeng.dev/2024/07/d193fe72ce3676bf643b0d1eb92dd4b7.gif)

  5). Create a new note with the `summary` and `date` property.
    
  ```markdown
  ---
  Name: test-custom-more
  Tags:
    - test
    - web
  summary: this is a summary for test custom
  date: 2022-05-03
  ---

  This is a test file.
  ```

  6). Sync the note to Notion.

  ![sync-custom](https://r2img.jxpeng.dev/2024/07/0e4cfbd61acdaf813fd81ee6d046e067.gif)
  
---

## Acknowledgment

Thanks to the [original author](https://github.com/EasyChris/obsidian-to-notion) for developing such a useful plugin that can synchronize Obsidian to Notion. However, the original repository can only sync Name and Tag information. For those like me who use [NotionNext](https://github.com/tangly1024/NotionNext) to set up their website, this presents some limitations. Every time I import, I need to make a lot of modifications.

Thus, based on the [original author's work](https://github.com/EasyChris/obsidian-to-notion), I've added a feature to match the [NotionNext](https://github.com/tangly1024/NotionNext) template. This way, you can edit directly in Obsidian and publish with a single click after organizing.

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
