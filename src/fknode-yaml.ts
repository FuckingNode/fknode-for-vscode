import * as vscode from "vscode";

export const suggestions = [
    {
        label: "divineProtection",
        kind: vscode.CompletionItemKind.Property,
        detail: "Divine protection, prevents certain cleanup features from affecting this project. Array or '*'.",
        insertText: "*",
    },
    {
        label: "cleanerShortCircuit",
        kind: vscode.CompletionItemKind.Property,
        detail: "Set to true to short-circuit the clean command whenever a cleanup task fails.",
        insertText: "false",
    },
    {
        label: "lintScript",
        kind: vscode.CompletionItemKind.Property,
        detail: "Project script used for linting (defaults to ESLint if unset). String.",
    },
    {
        label: "prettyScript",
        kind: vscode.CompletionItemKind.Property,
        detail: "Project script used for prettifying (defaults to Prettier if unset). String.",
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
        
    },
    {
        label: "commitMessage",
        kind: vscode.CompletionItemKind.Property,
        detail: "Custom commit message for automated commits. String.",
    },
    {
        label: "updaterOverride",
        kind: vscode.CompletionItemKind.Property,
        detail: "Override the update command with a custom script. String.",
    },
    {
        label: "flagless",
        kind: vscode.CompletionItemKind.Module,
        detail: "Flagless features settings. Object.",
    },
    {
        label: "releaseCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "CmdSet for the release command. Array of Cmds.",
    },
    {
        label: "releaseAlwaysDry",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, releases always use dry-run, defaults to false. Boolean.",
        
    },
    {
        label: "commitCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "CmdSet for the commit command. Array of Cmds.",
    },
    {
        label: "launchCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "CmdSet for the launch command. Array of Cmds.",
    },
    {
        label: "projectEnvOverride",
        kind: vscode.CompletionItemKind.Property,
        detail: "Override project environment inference (npm, pnpm, yarn, deno, bun, go, cargo).. If FuckingNode assumes this is a Node/pnpm project, but you set this to a different value, whatever you put here will take precedence.",
    },
    {
        label: "buildCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "CmdSet for the build command. Array of Cmds.",
    },
    {
        label: "buildForRelease",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, when running fkrelease, run buildCmd before (default true). Boolean.",
        
    },
    {
        label: "kickstartCmd",
        kind: vscode.CompletionItemKind.Property,
        detail: "If true, when running fkrelease, run buildCmd before (default true). Boolean.",
    },
    {
        label: "kickstarter",
        kind: vscode.CompletionItemKind.Property,
        detail: "Set some defaults for whenever you or another FuckingNode user kickstart this project's code repository."
    }
];
