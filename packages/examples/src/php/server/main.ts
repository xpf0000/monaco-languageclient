/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

// import { runLanguageServer } from '../../common/node/language-server-runner.js';
import { WebSocketServer } from 'ws';
import { spawn } from 'child_process';
import axios from 'axios';
import { JSONRPCClient } from 'json-rpc-2.0';
import {createWriteStream, writeFileSync, WriteStream} from 'fs';

const wait = (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

export const runPHPLanguageServer = () => {
    let websocket: any;
    const child = spawn('./php', [
        './phpactor.phar',
        'language-server',
        '-vvv'
    ], {
        cwd: '/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: false
    });
    child.stdout.on('data', (data) => {
        console.log('stdout: ', data.toString());
        const json = data.toString()?.split('\n').map((s) => s.trim()).find((s) => s.startsWith('{"') && s.endsWith('}'));
        console.log('json: ', json);
        if (json) {
            websocket.send(json);
        }
    });
    child.stderr.on('data', (data) => {
        console.log('stderr: ', data.toString());
    });
    child.on('error', (error) => {
        console.log('error: ', error.toString());
    });
    child.on('close', (code) => {
        console.log('close: ', code);
    });
    child.stdin.setDefaultEncoding('utf-8');
    child.stdin.on('close', () => {
        console.log('stdin close !!!');
    });
    child.stdin.on('finish', () => {
        console.log('stdin finish !!!');
    });
    child.stdin.on('error', (err) => {
        console.log('stdin error !!!', err);
    });
    child.stdin.on('drain', () => {
        console.log('stdin drain !!!');
    });
    child.stdin.on('pipe', () => {
        console.log('stdin pipe !!!');
    });
    child.stdin.on('unpipe', () => {
        console.log('stdin unpipe !!!');
    });

    const wss = new WebSocketServer({ port: 13455 });
    wss.on('connection', function connection(ws) {
        const send = (data: any) => {
            console.log('send: ', data);
            ws.send(JSON.stringify(data));
        };
        const id = 0;

        ws.on('error', console.error);

        ws.on('message', async (buffer) => {
            const data = JSON.parse(buffer.toString());
            console.log('ws message: ', data);
            if (data.method === 'initialize' && !(data.params?.rootUri)) {
                data.params.processId = child.pid;
                data.params.rootUri = 'file:///Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php';
            }
            const stdin = child.stdin;
            stdin.write(`Content-Length: ${JSON.stringify(data).length}\r\n\r\n${JSON.stringify(data)}\r\n`);
            websocket = ws;
        });

        // ws.send('something');
    });

    // runLanguageServer({
    //     serverName: 'PHP',
    //     pathName: '/',
    //     serverPort: 13455,
    //     runCommand: './php',
    //     runCommandArgs: [
    //         './phpactor.phar',
    //         'language-server',
    //         '--address',
    //         '127.0.0.1:13455'
    //     ],
    //     wsServerOptions: {
    //         noServer: true,
    //         perMessageDeflate: false
    //     },
    //     spawnOptions: {
    //         cwd: '/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php'
    //     }
    // });
};
