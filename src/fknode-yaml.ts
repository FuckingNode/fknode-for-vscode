import * as vscode from 'vscode';

export const suggestions = [
    {
        label: "divineProtection",
        kind: vscode.CompletionItemKind.Property,
        detail: "Divine protection, basically to prevent certain cleanup features to affect this project. Array.",
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
        detail: "Settings for the destroyer mechanism. Object.",
    },
    {
        label: "commitActions",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, changes we make via cleanup (e.g. by prettifying the code) will be committed to Git if there wasn't any uncommitted change in here before. Boolean.",
        insertText: "true",
    },
    {
        label: "commitMessage",
        kind: vscode.CompletionItemKind.Property,
        detail: "Custom commit message for automated commits. String.",
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
        detail: "Task to run on release. String.",
        insertText: "prerelease # would run 'npm run prerelease'",
    },
    {
        label: "releaseAlwaysDry",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, releases always use dry-run, defaults to false. Boolean.",
        insertText: "true",
    },
    {
        label: "commitCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "Task to run on commit. String.",
        insertText: "precommit # would run 'npm run precommit'",
    },
    {
        label: "launchCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "Task to run on launch. String. Analog to `launchFile`, only meant for NodeJS and BunJS.",
        insertText: "start # would run 'npm run start'",
    },
    {
        label: "launchFile",
        kind: vscode.CompletionItemKind.Property,
        detail: "File to execute when launchCmd is invoked. Analog to `launchCmd`, only meant for DenoJS, Cargo, and Golang. String.",
    },
    {
        label: "launchWithUpdate",
        kind: vscode.CompletionItemKind.Property,
        detail: "Update dependencies when running fklaunch. Boolean.",
        insertText: "true",
    },
    {
        label: "projectEnvOverride",
        kind: vscode.CompletionItemKind.Property,
        detail: "Override project environment inference. If FuckingNode assumes this is a Node/pnpm project, but you set this to a different value, whatever you put here will take precedence. String.",
    },
    {
        label: "buildCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "Command(s) for build. String. To add several commands, use carets for separation (`command-one^command-two`).",
        insertText: "build # would run 'npm run build'",
    },
    {
        label: "buildForRelease",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, when running fkrelease, run buildCmd before. Boolean.",
        insertText: "true",
    },
];
