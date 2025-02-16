import * as vscode from "vscode";
import { exec } from "child_process";

const completionProvider: vscode.CompletionItemProvider = {
    provideCompletionItems() {
        const completions: vscode.CompletionItem[] = [];

        const suggestions = [
            {
                label: "divineProtection",
                kind: vscode.CompletionItemKind.Property,
                detail: "Divine protection options",
            },
            {
                label: "lintCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Script used for linting (defaults to ESLint if unset).",
                insertText: "__USE_DEFAULT",
            },
            {
                label: "prettyCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Script used for prettifying (defaults to Prettier if unset).",
                insertText: "__USE_DEFAULT",
            },
            {
                label: "destroy",
                kind: vscode.CompletionItemKind.Module,
                detail: "Destroyer settings",
            },
            {
                label: "commitActions",
                kind: vscode.CompletionItemKind.Property,
                detail: "Automatically commit after an action (true/false)",
                insertText: "true",
            },
            {
                label: "commitMessage",
                kind: vscode.CompletionItemKind.Property,
                detail: "Custom commit message or __USE_DEFAULT",
                insertText: "__USE_DEFAULT",
            },
            {
                label: "updateCmdOverride",
                kind: vscode.CompletionItemKind.Property,
                detail: "Override the update command (default: __USE_DEFAULT)",
                insertText: "__USE_DEFAULT",
            },
            {
                label: "flagless",
                kind: vscode.CompletionItemKind.Module,
                detail: "Flagless features settings",
            },
            {
                label: "releaseCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Task to run on release",
            },
            {
                label: "releaseAlwaysDry",
                kind: vscode.CompletionItemKind.Property,
                detail: "If true, releases always use dry-run",
                insertText: "false",
            },
            {
                label: "commitCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Task to run on commit",
            },
        ];

        suggestions.forEach((s) => {
            const item = new vscode.CompletionItem(s.label, s.kind);
            item.detail = s.detail;
            completions.push(item);
        });

        return completions;
    },
};

function run(
    ctx: "bg" | "cli",
    command: string,
    message: string,
    cwd?: string,
    name?: string
) {
    switch (ctx) {
        case "bg": {
            exec(command, { cwd }, (error, stdout, stderr) => {
                vscode.window.showInformationMessage(message);
                if (error) {
                    vscode.window.showErrorMessage(`Error: ${stderr}`);
                    return;
                }
                vscode.window.showInformationMessage(`Output: ${stdout}`);
            });
            return;
        }
        case "cli": {
            const terminal =
                vscode.window.terminals.find((t) => t.name === name) ||
                vscode.window.createTerminal(name);
            terminal.show();
            terminal.sendText(command);
            return;
        }
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: "file", language: "yaml" },
            completionProvider
        )
    );

    const self = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    const commands = [
        {
            name: "fknode.clean",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode clean --self",
                    `Cleaning ${self}`,
                    self,
                    "fkclean"
                );
            },
        },
        {
            name: "fknode.audit",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode audit --self",
                    `Auditing ${self}`,
                    self,
                    "fkaudit"
                );
            },
        },
        {
            name: "fknode.auditStrict",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode audit --self -s",
                    `Strictly auditing ${self}`,
                    self,
                    "fkaudit (strict)"
                );
            },
        },
    ];

    commands.forEach((command) =>
        context.subscriptions.push(
            vscode.commands.registerCommand(command.name, command.handler)
        )
    );
}

export function deactivate() {}
