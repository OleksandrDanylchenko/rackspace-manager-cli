#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consoleDisplayer_1 = require("./cliModules/consoleDisplayer");
const rackspaceLocalConfigurer_1 = require("./rackspaceModules/rackspaceLocalConfigurer");
const consolePrompter_1 = require("./cliModules/consolePrompter");
const rackspaceRemoteConfigurer_1 = require("./rackspaceModules/rackspaceRemoteConfigurer");
const responsesFormatter_1 = require("./utils/responsesFormatter");
const consolePrompter = new consolePrompter_1.ConsolePrompter();
const rackspaceLocalConfigurer = new rackspaceLocalConfigurer_1.RackspaceLocalConfigurer();
const responsesFormatter = new responsesFormatter_1.ResponsesFormatter();
const rackspaceRemoteConfigurer = new rackspaceRemoteConfigurer_1.RackspaceRemoteConfigurer(responsesFormatter, rackspaceLocalConfigurer);
consoleDisplayer_1.ConsoleDisplayer.clearScreen();
consoleDisplayer_1.ConsoleDisplayer.displayAppHeader();
consoleDisplayer_1.ConsoleDisplayer.displaySpinnerText('Fetching local configuration');
rackspaceLocalConfigurer
    .readRackspaceConfig()
    .then(async (rackspaceConfig) => {
    consoleDisplayer_1.ConsoleDisplayer.successSpinnerText(`Fetched local configuration: ${JSON.stringify({ ...rackspaceConfig }, null, 2)}`);
    const args = consolePrompter.getConsoleArguments();
    await readCliArgsAndUpdateConfig(args, rackspaceConfig);
    const isRackspaceUpdated = await rackspaceRemoteConfigurer.updateRackspaceRecordsHeaders(args['container-path']);
    process.exit(isRackspaceUpdated ? 0 : 401);
})
    .catch((err) => consoleDisplayer_1.ConsoleDisplayer.failSpinnerText(err));
async function readCliArgsAndUpdateConfig(args, rackspaceConfig) {
    let isUpdated = false;
    if (!rackspaceConfig.rackspaceCloudUrl && !args['cloud-url']) {
        rackspaceLocalConfigurer.rackspaceCloudUrl = await consolePrompter.promptConsoleValue('Please provide a rackspace cloud public url: ');
        isUpdated = true;
    }
    if (!rackspaceConfig.rackspaceToken && !args['token']) {
        rackspaceLocalConfigurer.rackspaceToken = await consolePrompter.promptConsoleValue('Please provide a rackspace token id: ');
        isUpdated = true;
    }
    if (args['cloud-url']) {
        rackspaceLocalConfigurer.rackspaceCloudUrl = args['cloud-url'];
        isUpdated = true;
    }
    if (args['token']) {
        rackspaceLocalConfigurer.rackspaceToken = args['token'];
        isUpdated = true;
    }
    if (isUpdated) {
        consoleDisplayer_1.ConsoleDisplayer.displaySpinnerText('Updating local configuration');
        await rackspaceLocalConfigurer.writeRackspaceConfig();
        consoleDisplayer_1.ConsoleDisplayer.successSpinnerText('Updated local configuration');
    }
}
//# sourceMappingURL=cli.js.map