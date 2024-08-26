/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox and others.
 * Licensed under the MIT License. See LICENSE in the package root for license information.
 * ------------------------------------------------------------------------------------------ */

import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import { MonacoEditorLanguageClientWrapper, UserConfig } from 'monaco-editor-wrapper';
import { useWorkerFactory } from 'monaco-editor-wrapper/workerFactory';
import * as vscode from 'vscode';
// import {MonacoLanguageClient} from 'monaco-languageclient';

export const configureMonacoWorkers = () => {
    useWorkerFactory({
        rootPath: '/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php',
        ignoreMapping: true,
        workerLoaders: {
            editorWorkerService: () => new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url), { type: 'module' }),
        }
    });
};

const code = '<?php';

const userConfig: UserConfig = {
    wrapperConfig: {
        serviceConfig: {
            userServices: {
                ...getKeybindingsServiceOverride(),
            },
            debugLogging: true
        },
        editorAppConfig: {
            $type: 'extended',
            codeResources: {
                main: {
                    text: code,
                    fileExt: 'php'
                }
            },
            useDiffEditor: false,
            userConfiguration: {
                json: JSON.stringify({
                    'workbench.colorTheme': 'Default Dark Modern',
                    'editor.guides.bracketPairsHorizontal': 'active',
                    'editor.wordBasedSuggestions': 'off'
                })
            },
            editorOptions: {
                wordBasedSuggestions: 'off',
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                },
                parameterHints: {
                    enabled: true,
                },
            }
        }
    },
    languageClientConfig: {
        clientOptions: {
            workspaceFolder: {
                index: 0,
                name: 'workspace',
                uri: vscode.Uri.parse('/Users/x/Desktop/WorkSpace/GitHub/monaco-languageclient/packages/examples/src/php')
            },
            documentSelector: [
                { language: 'php', scheme: 'file' },
                { language: 'blade', scheme: 'file' },
                { language: 'php', scheme: 'untitled' },
            ],
        },
        name: 'PHP Language Client',
        languageId: 'php',
        options: {
            $type: 'WebSocketUrl',
            url: 'ws://127.0.0.1:13455'
        }
        // options: {
        //     $type: 'WebSocket',c
        //     secured: false,
        //     path: '/',
        //     port: 13455,
        //     host: '127.0.0.1',
        //     startOptions: {
        //         onCall(client: MonacoLanguageClient) {
        //             console.log('startOptions !!!');
        //         },
        //         reportStatus: true
        //     },
        //     stopOptions: {
        //         onCall(client: MonacoLanguageClient) {
        //             console.log('stopOptions !!!');
        //         },
        //         reportStatus: true
        //     }
        // }
    },
    loggerConfig: {
        enabled: true,
        debugEnabled: true
    }
};

export const runPHPClient = () => {
    const wrapper = new MonacoEditorLanguageClientWrapper();
    const htmlElement = document.getElementById('monaco-editor-root');

    try {
        document.querySelector('#button-start')?.addEventListener('click', async () => {
            await wrapper.initAndStart(userConfig, htmlElement);
        });
        document.querySelector('#button-dispose')?.addEventListener('click', async () => {
            await wrapper.dispose();
        });
    } catch (e) {
        console.error(e);
    }
};
