import readline from 'readline';
import yargs from 'yargs';

export interface YargsOptions {
  [p: string]: unknown;
  'cloud-url': string;
  token: string;
  'container-path': string;
  _: (string | number)[];
  $0: string;
}

export class ConsolePrompter {
  private static readonly _consolePrompt = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  promptConsoleValue = async (question: string): Promise<string> =>
    new Promise((resolve) => {
      ConsolePrompter._consolePrompt.question(question, (answer) => {
        ConsolePrompter._consolePrompt.pause();
        resolve(answer);
      });
    });

  getConsoleArguments = (): YargsOptions =>
    yargs.options({
      'cloud-url': { type: 'string', demandOption: false, alias: 'u' },
      token: { type: 'string', demandOption: false, alias: 't' },
      'container-path': { type: 'string', demandOption: true, alias: 'p' }
    }).argv;
}
