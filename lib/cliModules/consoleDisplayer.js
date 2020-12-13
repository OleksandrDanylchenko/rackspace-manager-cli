"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleDisplayer = void 0;
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const figlet_1 = tslib_1.__importDefault(require("figlet"));
const clear_1 = tslib_1.__importDefault(require("clear"));
const ora_1 = tslib_1.__importDefault(require("ora"));
class ConsoleDisplayer {
}
exports.ConsoleDisplayer = ConsoleDisplayer;
ConsoleDisplayer.clearScreen = () => clear_1.default();
ConsoleDisplayer.displayAppHeader = () => console.log(chalk_1.default.red(figlet_1.default.textSync('UPDATER', {
    font: 'Jacky',
    horizontalLayout: 'full'
})));
ConsoleDisplayer.displaySpinnerText = (spinnerText) => {
    ConsoleDisplayer.spinner = ora_1.default({
        text: spinnerText,
        spinner: 'star2',
        discardStdin: false
    }).start();
};
ConsoleDisplayer.successSpinnerText = (successSpinnerText) => ConsoleDisplayer.spinner
    .succeed(chalk_1.default.green(successSpinnerText || ConsoleDisplayer.spinner.text))
    .stop();
ConsoleDisplayer.failSpinnerText = (failSpinnerText) => ConsoleDisplayer.spinner
    .fail(chalk_1.default.red(failSpinnerText || ConsoleDisplayer.spinner.text))
    .stop();
//# sourceMappingURL=consoleDisplayer.js.map