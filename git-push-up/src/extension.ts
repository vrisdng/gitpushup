import * as vscode from 'vscode';
import { gitPushUp } from './functions';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-push-up" is now active!');
	const disposable = vscode.commands.registerCommand('git-push-up.gitpush', gitPushUp);

	context.subscriptions.push(disposable);
}

export function deactivate() {}
