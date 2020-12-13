"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsolePrompter = void 0;
const tslib_1 = require("tslib");
const readline_1 = tslib_1.__importDefault(require("readline"));
const yargs_1 = tslib_1.__importDefault(require("yargs"));
class ConsolePrompter {
    constructor() {
        this.promptConsoleValue = async (question) => new Promise((resolve) => {
            ConsolePrompter._consolePrompt.question(question, (answer) => {
                ConsolePrompter._consolePrompt.pause();
                resolve(answer);
            });
        });
        this.getConsoleArguments = () => yargs_1.default.options({
            'cloud-url': { type: 'string', demandOption: false, alias: 'u' },
            token: { type: 'string', demandOption: false, alias: 't' },
            'container-path': { type: 'string', demandOption: true, alias: 'p' }
        }).argv;
    }
}
exports.ConsolePrompter = ConsolePrompter;
ConsolePrompter._consolePrompt = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
//# sourceMappingURL=consolePrompter.js.map