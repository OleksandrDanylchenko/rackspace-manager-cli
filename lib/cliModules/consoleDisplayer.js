"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleDisplayer = void 0;
const chalk_1 = __importDefault(require("chalk"));
const figlet_1 = __importDefault(require("figlet"));
const clear_1 = __importDefault(require("clear"));
const ora_1 = __importDefault(require("ora"));
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