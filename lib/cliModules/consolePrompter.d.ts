export interface YargsOptions {
    [p: string]: unknown;
    'cloud-url': string;
    token: string;
    'container-path': string;
    _: (string | number)[];
    $0: string;
}
export declare class ConsolePrompter {
    private static readonly _consolePrompt;
    promptConsoleValue: (question: string) => Promise<string>;
    getConsoleArguments: () => YargsOptions;
}
