import * as vscode from "vscode";
import { exec } from "child_process";

const completionProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        const suggestions = [
            {
                label: "divineProtection",
                kind: vscode.CompletionItemKind.Property,
                detail: "Divine protection options",
                insertText: "*",
            },
            {
                label: "lintCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Script used for linting (defaults to ESLint if unset). String.",
                insertText: "lint # would run 'npm run lint'",
            },
            {
                label: "prettyCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Script used for prettifying (defaults to Prettier if unset). String.",
                insertText: "prettify # would run 'npm run prettify'",
            },
            {
                label: "destroy",
                kind: vscode.CompletionItemKind.Module,
                detail: "Destroyer settings. Object.",
            },
            {
                label: "commitActions",
                kind: vscode.CompletionItemKind.Property,
                detail: "Automatically commit after an action. Boolean.",
                insertText: "true",
            },
            {
                label: "commitMessage",
                kind: vscode.CompletionItemKind.Property,
                detail: "Custom commit message to override FuckingNode's default message for automated commits. String.",
            },
            {
                label: "updateCmdOverride",
                kind: vscode.CompletionItemKind.Property,
                detail: "Override the update command with a custom script. String.",
                insertText: "update # would run 'npm run update'",
            },
            {
                label: "flagless",
                kind: vscode.CompletionItemKind.Module,
                detail: "Flagless features settings. Object.",
            },
            {
                label: "releaseCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Task to run on release. String,",
                insertText: "prerelease # would run 'npm run prerelease'",
            },
            {
                label: "releaseAlwaysDry",
                kind: vscode.CompletionItemKind.Property,
                detail: "If true, releases always use dry-run, defaults to false. Boolean.",
                insertText: "false",
            },
            {
                label: "commitCmd",
                kind: vscode.CompletionItemKind.Property,
                detail: "Task to run on commit. String.",
                insertText: "precommit # would run 'npm run precommit'",
            },
        ];

        suggestions.forEach((s) => {
            const item = new vscode.CompletionItem(s.label, s.kind);
            item.detail = s.detail;
            item.insertText = s.insertText;
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
): void {
    switch (ctx) {
        case "bg": {
            exec(command, { cwd }, (error, stdout, stderr) => {
                vscode.window.showInformationMessage(message);
                // TODO - remove cli coloring and stuff from output
                // string-utils my beloved would've made it easier
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
            name: "fknode.cleanHard",
            handler: () => {
                run(
                    "bg",
                    "fuckingnode hard-clean",
                    `Cleaning all of your package managers' cache`,
                    self,
                    "fkclean (hard)"
                );
            },
        },
        // https://code.visualstudio.com/api/references/vscode-api#window.showInputBox
        {
            name: "fknode.changeSettings",
            handler: async () => {
                const settingToChange: string | undefined =
                    await vscode.window.showQuickPick(
                        [
                            "Default cleaner intensity",
                            "Favorite IDE/editor",
                            "Log flush frequency",
                            "Update check frequency",
                        ],
                        {
                            canPickMany: false,
                            ignoreFocusOut: false,
                            title: "Choose setting to change",
                        }
                    );

                const value = await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: `Enter new value for ${settingToChange}`,
                    prompt: "What do you want to set this setting to?",
                    title: `Change ${settingToChange}`,
                });

                // here i'd use jsr:@zakahacecosas/string-utils but it does not work here :sob:
                if (
                    ![
                        "Default cleaner intensity",
                        "Favorite IDE/editor",
                        "Log flush frequency",
                        "Update check frequency",
                    ].includes(settingToChange ?? "")
                ) {
                    throw new Error("Invalid setting");
                }

                const actualSettingToChange:
                    | "updateFreq"
                    | "flushFreq"
                    | "defaultIntensity"
                    | "favEditor" =
                    settingToChange === "Update check frequency"
                        ? "updateFreq"
                        : settingToChange === "Log flush frequency"
                        ? "flushFreq"
                        : settingToChange === "Default cleaner intensity"
                        ? "defaultIntensity"
                        : "favEditor";

                run(
                    "bg",
                    `fuckingnode settings change ${actualSettingToChange} ${value}`,
                    `Changing ${settingToChange} to ${value}`,
                    self,
                    `fuckingnode settings change`
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
        {
            name: "fknode.upgrade",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode upgrade",
                    `Checking for updates`,
                    self,
                    "fuckingnode upgrade"
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
