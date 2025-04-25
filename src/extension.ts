import * as vscode from 'vscode';

/**
 * 扩展激活时调用的函数
 * @param context 扩展上下文，用于管理扩展的资源和状态
 */
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "cursor-expand-folder" is now active!,cursor-expand-folder已激活');

    /**
     * 递归 尝试显示（Reveal）一个文件夹及其指定层级的子文件夹
     * @param folderUri 要显示的文件夹的 URI
     * @param depth 要递归显示的层级深度
     */
    async function revealFolderAndChildren(folderUri: vscode.Uri, depth: number): Promise<void> {
        if (depth <= 0) {
            return;
        }

        try {
            // 1. 尝试显示当前文件夹本身
            await vscode.commands.executeCommand('revealInExplorer', folderUri);

            // 2. 读取当前文件夹的子项
            const entries = await vscode.workspace.fs.readDirectory(folderUri);
            
            // 3. 遍历子项
            for (const [name, type] of entries) {
                if (type === vscode.FileType.Directory) {
                    const childUri = vscode.Uri.joinPath(folderUri, name);
                    // 递归调用，显示子文件夹及其更深层级的子文件夹
                    await revealFolderAndChildren(childUri, depth - 1);
                }
            }
        } catch (error) {
            console.error(`尝试显示 ${folderUri.fsPath} 或其子项时出错:`, error);
        }
    }


    /**
     * 注册核心命令：递归展开选中的文件夹
     * @param {vscode.Uri | undefined} uri - 单个选中的资源 URI (主要来自右键菜单或直接调用)
     * @param {vscode.Uri[] | undefined} uris - 多个选中的资源 URI 列表 (主要来自右键菜单多选)
     */
    let disposable = vscode.commands.registerCommand('cursorUtils.expandRecursively', async (uri?: vscode.Uri, uris?: vscode.Uri[]) => {
        let selectedUris: vscode.Uri[] = [];
        // --- 修改：明确处理快捷键调用时无法获取选中项的情况 ---
        if (uris && uris.length > 0) {
            // 优先使用右键多选传入的 uris
            selectedUris = uris;
        } else if (uri) {
            // 使用右键单选或命令面板传入的 uri
             selectedUris = [uri];
        } else {
             // 如果 uri 和 uris 都未提供 (通常意味着通过快捷键调用)
             // 直接提示用户 API 限制，推荐使用右键菜单
             vscode.window.showInformationMessage('快捷键操作无法可靠获取选中项，请使用【右键菜单】中的 "Expand Folder Recursively" 功能。');
             return; // 中止执行
         }
        // 定义递归显示的层级深度
        const expansionDepth = 99; // 保持较大的深度

        const foldersToExpand: vscode.Uri[] = [];

        try {
            const statsPromises = selectedUris.map(u => vscode.workspace.fs.stat(u));
            const stats = await Promise.all(statsPromises);

            for (let i = 0; i < selectedUris.length; i++) {
                if (stats[i].type === vscode.FileType.Directory) {
                    foldersToExpand.push(selectedUris[i]);
                }
            }
        } catch (error) {
            console.error("获取文件状态时出错:", error);
            vscode.window.showErrorMessage(`检查选中项目类型时出错: ${error instanceof Error ? error.message : String(error)}`);
            return;
        }

        if (foldersToExpand.length === 0) {
            // 如果通过右键菜单触发，但选中的不是文件夹
            vscode.window.showInformationMessage('选中的项目中没有文件夹。');
            return;
        }

        // 显示进度条
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "正在处理文件夹展开...",
            cancellable: false
        }, async (progress) => {
            let successCount = 0;
            let errorCount = 0;

            for (const folderUri of foldersToExpand) {
                try {
                    progress.report({ message: `处理 ${folderUri.fsPath}` });
                    await revealFolderAndChildren(folderUri, expansionDepth);
                    successCount++;
                } catch (err: unknown) {
                    errorCount++;
                    console.error(`处理文件夹 ${folderUri.fsPath} 展开时出错:`, err);
                    vscode.window.showWarningMessage(`处理文件夹 ${folderUri.path} 时出错: ${err instanceof Error ? err.message : String(err)}`);
                }
            }

            if (errorCount === 0) {
                 vscode.window.showInformationMessage(`已成功处理 ${successCount} 个文件夹的展开请求。`);
            } else if (successCount > 0) {
                 vscode.window.showWarningMessage(`尝试处理 ${foldersToExpand.length} 个文件夹，其中 ${successCount} 个成功，${errorCount} 个失败。`);
            } else {
                 vscode.window.showErrorMessage(`处理 ${foldersToExpand.length} 个文件夹时均遇到错误。`);
            }
        });
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {
    console.log('Extension "cursor-expand-folder" is now deactivated.,cursor-expand-folder已失效');
} 