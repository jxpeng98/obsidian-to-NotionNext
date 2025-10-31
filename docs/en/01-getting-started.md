---
title: Getting Started
description: Guide to setting up the Obsidian to NotionNext plugin
---

# Getting Started

## Get Notion API Token

Before using the plugin, you need to obtain an API Token from Notion to allow the plugin to access your Notion account.

1. Go to the [Notion API](https://www.notion.so/profile/integrations) page to create a new integration. You need to be logged into your Notion account.
2. Click on `+ New integration`.
![new-integration](https://r2imga.jxpeng.dev/2025/10/3d12358494c000ab7035820e1e836934.png)
3. Fill in the required information:
![integration-info](https://r2imga.jxpeng.dev/2025/10/645b8182105e5e64e61bd263394534d6.png)
4. Integration successfully created.
![success](https://r2imga.jxpeng.dev/2025/10/57ea92c48efc15b95a69f3663424f5ae.png)
5. Enter the "Configure integration settings" page and **prepare to copy the API Token,** which you will need in the plugin settings.
![configure-integration](https://r2imga.jxpeng.dev/2025/10/4a50e55c35e47f905fb7fe63af5c8402.png)

::: warning
**⚠️ Note:** Keep your API Token secure and do not share it with others, as it grants access to your Notion data.
:::

## Create a Notion Database and Connect Integration

Next, you need to create a Notion database to store the notes synced from Obsidian.

1. In your Notion workspace, click on `Create a new page` to create a new page.
![create-new-page](https://r2imga.jxpeng.dev/2025/10/1f092ef1d8c5a25aeb75694d654810a1.png)

2. create a new page and select the `Database - Full page` option.
![new-database](https://r2imga.jxpeng.dev/2025/10/73b700fc65a53f2ff518b58832bf9757.png)

3. Click the `...` menu in the top-right corner of the database page, go to `Connections`, and connect your newly created integration.
![connect-integration](https://r2imga.jxpeng.dev/2025/10/e8d9be4718f6f5c76fdc3bee7d694d23.png)

4. Click `Share` -> `Publish` to publish the database to the web.
![publish](https://r2imga.jxpeng.dev/2025/10/4b1d3f597d67508ee67d20a62151200f.png)

5. Click and copy the **Database ID**.
![database-id](https://r2imga.jxpeng.dev/2025/10/d8f22c1daf5063305256e5e50210adf9.png)

Next, you can proceed to install and configure the plugin in Obsidian by following the [Installation Guide](./02-installation.md).
