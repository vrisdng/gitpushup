import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "git-push-up" is now active!');
	const disposable = vscode.commands.registerCommand('git-push-up.gitpush', () => {
		vscode.window.showInformationMessage('Activating git push up');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
