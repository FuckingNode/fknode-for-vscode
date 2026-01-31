/* self note:
 * vsce publish to publish the extension
 * don't forget to update the version in package.json
 * and the changelog in CHANGELOG.md
 */
import * as vscode from "vscode";
import { exec } from "child_process";
import { suggestions } from "./fknode-yaml";
import { stripVTControlCharacters } from "util";

const completionProvider: vscode.CompletionItemProvider = {
    provideCompletionItems(): vscode.CompletionItem[] {
        const completions: vscode.CompletionItem[] = [];

        suggestions.forEach((s) => {
            const item = new vscode.CompletionItem(s.label, s.kind);
            item.detail = s.detail;
            item.insertText = s.insertText;
            completions.push(item);
        });

        return completions;
    },
};

const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

const SETTINGS_MAP = {
    "Default cleaner intensity": "default-intensity",
    "Favorite IDE/editor": "fav-editor",
    "Update check frequency": "update-freq",
    "Default package manager": "default-manager",
    "Enable/disable notifications": "notifications",
    "Enable/disable cleaner short-circuiting": "always-short-circuit-cleanup",
    "Kickstarted projects root": "kickstart-root",
    "Default workspace cloning policy": "workspace-policy",
} as const;

function run(ctx: "bg" | "cli", command: string, message: string, name: string): void {
    if (!cwd) {
        vscode.window.showErrorMessage("No workspace folder open");
        return;
    }

    if (ctx === "bg") {
        exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(stripVTControlCharacters(stderr || error.message));
                return;
            }

            vscode.window.showInformationMessage(message);
            if (stdout) {
                vscode.window.showInformationMessage(stripVTControlCharacters(stdout));
            }
        });
        return;
    }

    const terminal =
        vscode.window.terminals.find((t) => t.name === name) ?? vscode.window.createTerminal(name);
    terminal.show();
    terminal.sendText(command);
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { language: "yaml", pattern: "**/fknode*.yml" },
            completionProvider
        )
    );

    const commands = [
        {
            name: "fknode.clean",
            handler: () => {
                run("cli", "fuckingnode clean .", `Cleaning ${cwd}`, "fkclean");
            },
        },
        {
            name: "fknode.cleanHard",
            handler: () => {
                run(
                    "bg",
                    "fuckingnode hard-clean",
                    "Cleaning all of your package managers' cache",
                    "fkclean (hard)"
                );
            },
        },
        // https://code.visualstudio.com/api/references/vscode-api#window.showInputBox
        {
            name: "fknode.changeSettings",
            handler: async () => {
                const settingToChange = await vscode.window.showQuickPick(
                    Object.keys(SETTINGS_MAP),
                    { title: "Choose setting to change" }
                );

                if (!settingToChange) {
                    return;
                }

                const value = await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: `Enter new value for ${settingToChange}`,
                    prompt: "What do you want to set this setting to?",
                    title: `Change ${settingToChange}`,
                });

                if (!value) {
                    return;
                }

                const actualSettingToChange =
                    SETTINGS_MAP[settingToChange as keyof typeof SETTINGS_MAP];

                run(
                    "bg",
                    `fuckingnode settings change ${actualSettingToChange} ${value}`,
                    `Changing ${settingToChange} to ${value}`,
                    "fuckingnode settings change"
                );
            },
        },
        {
            name: "fknode.commit",
            handler: async () => {
                const commitMessage = await vscode.window.showInputBox({
                    ignoreFocusOut: true,
                    placeHolder: "Enter a commit message here",
                    prompt: "What are you committing?",
                    title: "Make a Git commit (only already staged files)",
                });

                if (!commitMessage) {
                    return;
                }

                // TODO: add a files prompt

                // here i'd use jsr:@zakahacecosas/string-utils but it does not work here :sob:
                run(
                    "cli",
                    `fuckingnode commit "${commitMessage}" --keep-staged`,
                    `Committing "${commitMessage}"`,
                    "fkcommit"
                );
            },
        },
        {
            name: "fknode.audit",
            handler: () => {
                run("cli", "fuckingnode audit .", `Auditing ${cwd}`, "fkaudit");
            },
        },
        {
            name: "fknode.upgrade",
            handler: () => {
                run("cli", "fuckingnode upgrade", "Checking for updates", "fuckingnode upgrade");
            },
        },
        {
            name: "fknode.help",
            handler: () => {
                run("cli", "fuckingnode help", "Checking FuckingNode help menu", "fkhelp");
            },
        },
    ];

    commands.forEach((command) =>
        context.subscriptions.push(vscode.commands.registerCommand(command.name, command.handler))
    );
}

export function deactivate() {}
