/* self note:
 * vsce publish to publish the extension
 * don't forget to update the version in package.json
 * and the changelog in CHANGELOG.md
 */
import * as vscode from "vscode";
import { exec } from "child_process";
import { suggestions } from "./fknode-yaml";

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

function run(
    ctx: "bg" | "cli",
    command: string,
    message: string,
    name?: string
): void {
    if (ctx === "bg") {
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
    } else {
        const terminal =
            vscode.window.terminals.find((t) => t.name === name) ||
            vscode.window.createTerminal(name);
        terminal.show();
        terminal.sendText(command);
        return;
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            { scheme: "file", language: "yaml" },
            completionProvider
        )
    );

    const commands = [
        {
            name: "fknode.clean",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode clean .",
                    `Cleaning ${cwd}`,
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
                    `fuckingnode settings change`
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
                    title: `Make a Git commit`,
                });

                // TODO: add a files prompt

                // here i'd use jsr:@zakahacecosas/string-utils but it does not work here :sob:
                run(
                    "cli",
                    `fuckingnode commit "${commitMessage}" --keep-staged`,
                    `Committing "${commitMessage}"`,
                    `fkcommit`
                );
            },
        },
         {
             name: "fknode.audit",
             handler: () => {
                 run(
                     "cli",
                     "fuckingnode audit .",
                     `Auditing ${cwd}`,
                     "fkaudit"
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
                    "fuckingnode upgrade"
                );
            },
        },
        {
            name: "fknode.help",
            handler: () => {
                run(
                    "cli",
                    "fuckingnode help",
                    `Seeing help menu`,
                    "fkhelp"
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

export function deactivate() { }
