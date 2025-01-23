import * as vscode from 'vscode';
import path from 'path';
import { spawn } from 'child_process';

let PUSH_UP_TARGET = 5;

export const gitPushUp = async () => {
    vscode.window.showInformationMessage('Activating git push up');
    vscode.window.showInformationMessage(
        `Current push-up target is ${PUSH_UP_TARGET}.`
        + " If you want to change your push-up target, use command 'Change Push Up Target'."
    )
    
    const isWindows = process.platform === 'win32';
    
    const isMacLinux = !isWindows;

    const envPath = '"' + path.join(__dirname, '..', 'script/.venv/gitpushup/Scripts/activate') + '"';

    const pythonPath = '"' + path.join(__dirname, '..', 'script/script.py') + '"';
    const pythonCommand = isMacLinux ? 'python3' : 'python'; 
    const randomString = crypto.randomUUID();
    const command = isMacLinux
        ? `source ${envPath} && ${pythonCommand} ${pythonPath} ${randomString} ${PUSH_UP_TARGET}`
        : `${envPath} && ${pythonCommand} ${pythonPath} ${randomString} ${PUSH_UP_TARGET}`;

    console.log(command);
    let i = 0;
    const ls = spawn(command, {
        shell: true,
    });
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        for (const line of String(data).split('\n')) {
            const parts = line.trim().split(' ');
            if (parts.length !== 2) {
                continue;
            }
            if (parts[0] !== randomString) {
                continue;
            }
            if (Number(parts[1]) !== i) {
                continue;
            }
            i++;
            console.log("i", i);
            if (i === PUSH_UP_TARGET) {
                vscode.window.showInformationMessage('Pushing up to origin');
                pushToOrigin();
            }
        }
    });
    ls.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });
        
    ls.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
        
    ls.on('exit', (code) => {
        console.log(`child process exited with code ${code}`);
    });
};

const pushToOrigin = async () => {
    const terminal = vscode.window.createTerminal('git-push-up');
    terminal.show();
    terminal.sendText('git push origin', true);
};

export const setPushUpTarget = async (isInitial: boolean) => {
    const input = await vscode.window.showInputBox({
        prompt: 'Change your push-up target [1-100]:',
        validateInput: (value) => {
            const num = Number(value);
            if (isNaN(num) || num < 1 || num > 100) {
                return 'Please enter a valid number between 1 and 100';
            }
            return null;
        },
    });

    if (input !== undefined) {
        PUSH_UP_TARGET = Number(input);
        if (PUSH_UP_TARGET === 0 || PUSH_UP_TARGET === 1) {
            vscode.window.showWarningMessage('Wow really?');
        } else if (PUSH_UP_TARGET === 100) {
            vscode.window.showWarningMessage('Are you sure about that?');
        } else {
            vscode.window.showInformationMessage(`Push-up target set to ${PUSH_UP_TARGET}`);
        }
    }
};
