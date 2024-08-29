import * as vscode from 'vscode';
import getKeybindingsServiceOverride from '@codingame/monaco-vscode-keybindings-service-override';
import '@codingame/monaco-vscode-python-default-extension';
import '@codingame/monaco-vscode-cpp-default-extension';
import { UserConfig } from 'monaco-editor-wrapper';
import { MonacoLanguageClient } from 'monaco-languageclient';

/**
 * Creates a user configuration object for the code editor.
 *
 * @param {string} code - The code to be used in the editor.
 * @return {UserConfig} The user configuration object.
 */

export const createUserConfigPython = (code: string, codeOriginal?: string, useLanguageServer?: boolean, editorOptions?: any): UserConfig => {
    return {
        languageClientConfig: {
            options: {
                name: 'Python Language Server Example',
                $type: 'WebSocket',
                host: useLanguageServer? 'python-lsp.test.de' : 'noServer',
                port: 443,
                path: 'pyright',
                extraParams: {
                    authorization: 'UserAuth'
                },
                secured: true,
                startOptions: {
                    onCall: (languageClient?: MonacoLanguageClient) => {
                        setTimeout(() => {
                            ['pyright.restartserver', 'pyright.organizeimports'].forEach((cmdName) => {
                                vscode.commands.registerCommand(cmdName, (...args: unknown[]) => {
                                    languageClient?.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
                                });
                            });
                        }, 250);
                    },
                    reportStatus: true,
                }
            },
            clientOptions: {
                documentSelector: ['python'],
                workspaceFolder: {
                    index: 0,
                    name: 'workspace',
                    uri: vscode.Uri.parse('/workspace/')
                },
            },
        },
        wrapperConfig: {
            serviceConfig: {
                userServices: {
                    ...getKeybindingsServiceOverride()
                },
                debugLogging: true
            },
            editorAppConfig: {
                $type: 'extended',
                languageId: 'python',
                codeUri: '/workspace/python.py',
                extensions: [{
                    config: {
                        name: 'python-client',
                        publisher: 'monaco-languageclient-project',
                        version: '1.0.0',
                        engines: {
                            vscode: '^1.85.0'
                        },
                        contributes: {
                            languages: [{
                                id: 'python',
                                extensions: ['.py', 'pyi'],
                                aliases: ['python'],
                                mimetypes: ['application/python'],
                            }],
                        }
                    }
                }],
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': editorOptions?.theme || 'vs-bright',
                    })
                },
                useDiffEditor: codeOriginal !== undefined,
                code,
                codeOriginal
            }
        }
    };
};
export const createUserConfigCpp = (code: string, codeOriginal?: string, useLanguageServer?: boolean, editorOptions?: any): UserConfig => {
    return {
        languageClientConfig: {
            options: {
                name: 'C++ Language Server',
                $type: 'WebSocket',
                host: useLanguageServer? 'localhost' : 'noServer',
                port: 8081,
                path: 'ccls',
                extraParams: {
                    authorization: 'UserAuth'
                },
                secured: false,
                startOptions: {
                    onCall: (languageClient?: MonacoLanguageClient) => {
                        setTimeout(() => {
                            ['ccls.restartserver', 'ccls.organizeimports'].forEach((cmdName) => {
                                vscode.commands.registerCommand(cmdName, (...args: unknown[]) => {
                                    languageClient?.sendRequest('workspace/executeCommand', { command: cmdName, arguments: args });
                                });
                            });
                        }, 250);
                    },
                    reportStatus: true,
                }
            },
            clientOptions: {
                documentSelector: ['cpp'],
                workspaceFolder: {
                    index: 0,
                    name: 'workspace',
                    uri: vscode.Uri.parse('/workspace/')
                },
            },
        },
        wrapperConfig: {
            serviceConfig: {
                userServices: {
                    ...getKeybindingsServiceOverride()
                },
                debugLogging: true
            },
            editorAppConfig: {
                $type: 'extended',
                languageId: 'cpp',
                codeUri: '/workspace/example.cpp',
                extensions: [{
                    config: {
                        name: 'cpp-client',
                        publisher: 'monaco-languageclient-project',
                        version: '1.0.0',
                        engines: {
                            vscode: '^1.85.0'
                        },
                        contributes: {
                            languages: [{
                                id: 'cpp',
                                extensions: ['.cpp', '.h'],
                                aliases: ['cpp'],
                                mimetypes: ['application/cpp'],
                            }],
                        }
                    }
                }],
                userConfiguration: {
                    json: JSON.stringify({
                        'workbench.colorTheme': editorOptions?.theme || 'vs-bright',
                    })
                },
                useDiffEditor: codeOriginal !== undefined,
                code,
                codeOriginal
            }
        }
    };
};
