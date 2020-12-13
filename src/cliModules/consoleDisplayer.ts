import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';

export class ConsoleDisplayer {
  clearScreen = (): void => clear();

  displayAppHeader = (): void =>
    console.log(
      chalk.yellow(
        figlet.textSync('UPDATER', {
          font: 'Bloody',
          horizontalLayout: 'full'
        })
      )
    );
}
