# Cursor 文件夹展开插件

一个提升 Cursor 编辑器使用效率的插件。解决了 Cursor 只有一键收起项目目录功能，没有一键展开目录功能的问题。同时也解决了 Cursor 在处理文件夹时的"懒加载"问题 - 直接拖入文件夹时不会逐个读取文件，需要手动展开才会读取。

## 功能特点

- 一键递归展开选中的文件夹
- 支持多文件夹同时展开
- 支持右键菜单操作（推荐）
- 支持快捷键操作（Mac: `cmd+alt+e`, Windows/Linux: `ctrl+alt+e`）
- 展开过程中显示进度提示
- 智能错误处理和状态反馈

## 安装方法

1. 下载插件
   - 从 [Release](https://github.com/your-username/cursor-expand-folder/releases) 页面下载最新的 `.vsix` 文件
   - 或者直接下载本仓库中的 `cursor-expand-folder-0.0.4.vsix` 文件

2. 在 Cursor 中安装
   - 打开 Cursor
   - 按下 `Cmd+Shift+P`(Mac) 或 `Ctrl+Shift+P`(Windows/Linux) 打开命令面板
   - 输入 "Install from VSIX"
   - 选择下载的 `.vsix` 文件
   - 重启 Cursor 使插件生效

## 使用方法

1. 右键菜单方式（推荐）
   - 在文件浏览器中选中一个或多个文件夹
   - 右键点击，选择 "Expand Folder Recursively"
   - 插件会自动递归展开所选文件夹

2. 快捷键方式(由于 api能力限制，无法使用快捷键，未来可能开放)
   - Mac: `cmd+alt+e`
   - Windows/Linux: `ctrl+alt+e`
   - 注意：由于 VS Code API 限制，快捷键方式需要先在文件浏览器中选中文件夹

## 注意事项

- 插件会递归展开所选文件夹下的所有子文件夹
- 展开深度默认设置为 99 层，足以应对大多数项目结构
- 展开过程中会显示进度提示，可以看到处理进度
- 如果遇到错误，插件会给出友好的错误提示

## 开发背景

这个插件源于日常使用 Cursor 编辑器时的一个痛点。虽然 Cursor 提供了一键收起目录的功能，但缺少一键展开的功能。特别是在处理新项目时，由于 Cursor 采用懒加载策略，直接拖入的文件夹不会自动展开和读取所有文件，需要手动一个个展开才能让 Cursor 完全读取项目结构。这个插件就是为了解决这个问题，让开发者能够更高效地使用 Cursor。

## 反馈与建议

如果你在使用过程中遇到任何问题，或者有任何改进建议，欢迎提出 Issue 或 Pull Request。

# 如何开发

1. 克隆仓库

```bash
git clone https://github.com/zo-no/cursor-Expand-folder.git
```

2. 安装依赖

```bash
npm install
```

3. 运行插件

```bash
npm run watch
```

4. 编译

```bash
npm install -g @vscode/vsce
vsce package
```

由此获得vsix文件，在Cursor中安装
