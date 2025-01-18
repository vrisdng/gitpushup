import * as vscode from 'vscode';
import path from 'path';
import { spawn } from 'child_process';

export const gitPushUp = async () => {
    vscode.window.showInformationMessage('Activating git push up');
    const envPath = '"' + path.join(__dirname, '..', 'script/.venv/gitpushup/Scripts/activate') + '"';
    const pythonPath = '"' + path.join(__dirname, '..', 'script/script.py') + '"';
    const randomString = crypto.randomUUID();
    const command = `${envPath} && python ${pythonPath} ${randomString}`;
    console.log(command);
    const ls = spawn(command, {
        shell: true,
    });
    ls.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
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
