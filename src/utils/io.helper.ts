import readline from 'readline';
import yargs from 'yargs';

const cliPrompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

export const promptConsoleValue = async (question: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cliPrompt.question(question, (answer) => {
      cliPrompt.pause();
      resolve(answer);
    });
  });
};

export const promptConsoleArguments = (): any =>
  yargs.options({
    'cloud-url': { type: 'string', demandOption: false, alias: 'cu' },
    token: { type: 'string', demandOption: false, alias: 't' },
    'container-path': { type: 'string', demandOption: true, alias: 'p' }
  }).argv;
