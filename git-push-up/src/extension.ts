import * as vscode from 'vscode';
import { gitPushUp, setPushUpTarget } from './functions';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-push-up" is now active!');
	const main = vscode.commands.registerCommand('git-push-up.gitpush', gitPushUp);
	const changeTarget = vscode.commands.registerCommand('git-push-up.change-target', setPushUpTarget);

	context.subscriptions.push(main);
	context.subscriptions.push(changeTarget);
}

export function deactivate() {}
