## Fix
- fixed the issue that you cannot have empty values in the front matter of the customised database.
- 修复了自定义数据库的前置数据中不能有空值的问题。
For example, you have the property `tag` in your customised database, and you do not want to sync `tag` to Notion. You can remove the  `tag` from the front matter.
- 例如，自定义数据库中有属性`tag`，但是你不想将`tag`同步到Notion。现在，你可以直接在frontmatter中删除`tag`。


## Improvement
**⚠️⚠️⚠️: The exist customised database should be recreated if you want to update to version 2.3.0. The new version has a new database structure, and the old database structure is not compatible with the new version to build the index properly.**

### 自定义数据库用户
**⚠️⚠️⚠️: 如果你想要更新到2.3.0版本，你需要重新创建自定义数据库。新版本有一个新的数据库结构，旧的数据库结构无法构建索引。**

- redesigned the way to create new customised database. The modal has been removed with a more straightforward layout.
- 重新设计了自定义数据库的创建方式。已删除模态框，采用更直观的布局。
![](https://minioapi.pjx.ac.cn/img1/2024/07/7a1550aefd71175c981077ce46d03c87.png)


- improved the edit modal for customised database. The layout has been simplified and the form has been reorganized.
- 改进了自定义数据库的编辑模态框。简化了布局，重新组织了表单。
![](https://minioapi.pjx.ac.cn/img1/2024/07/471ea519b7cb3fba8f0b57956bb1f973.png)

- improved the preview modal for customised database. 
- 改进了自定义数据库的预览模态框。
![](https://minioapi.pjx.ac.cn/img1/2024/07/9599d77116afad065d2e31129942acc7.png)
