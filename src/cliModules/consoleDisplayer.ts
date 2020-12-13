import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import ora, { Ora } from 'ora';

export class ConsoleDisplayer {
  private static spinner: Ora;

  static clearScreen = (): void => clear();

  static displayAppHeader = (): void =>
    console.log(
      chalk.yellow(
        figlet.textSync('UPDATER', {
          font: 'Bloody',
          horizontalLayout: 'full'
        })
      )
    );

  static displayRecords = (records: string[]): void =>
    records.forEach((record) => console.log(chalk.blue(record)));

  static displayError = (errorMessage: string): void =>
    console.error(chalk.red(errorMessage));

  static displaySpinnerText = (spinnerText: string): void => {
    ConsoleDisplayer.spinner = ora({
      text: spinnerText,
      spinner: 'squish',
      discardStdin: false
    }).start();
  };

  static successSpinnerText = (successSpinnerText?: string): Ora =>
    ConsoleDisplayer.spinner
      .succeed(chalk.green(successSpinnerText || ConsoleDisplayer.spinner.text))
      .stop();

  static failSpinnerText = (failSpinnerText?: string): Ora =>
    ConsoleDisplayer.spinner
      .fail(chalk.red(failSpinnerText || ConsoleDisplayer.spinner.text))
      .stop();
}
