import * as vscode from 'vscode';
import path from 'path';
import { spawn } from 'child_process';

const PUSH_UP_TARGET = 5;

export const gitPushUp = async () => {
    vscode.window.showInformationMessage('Activating git push up');
    const envPath = '"' + path.join(__dirname, '..', 'script/.venv/gitpushup/Scripts/activate') + '"';
    const pythonPath = '"' + path.join(__dirname, '..', 'script/script.py') + '"';
    const randomString = crypto.randomUUID();
    const command = `${envPath} && python ${pythonPath} ${randomString}`;
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
                return;
            }
            if (parts[0] !== randomString) {
                return;
            }
            if (Number(parts[1]) !== i) {
                return;
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
};
