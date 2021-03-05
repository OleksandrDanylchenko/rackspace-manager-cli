"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RackspaceRemoteConfigurer = void 0;
const child_process_1 = require("child_process");
const node_fetch_1 = __importDefault(require("node-fetch"));
const consoleDisplayer_1 = require("../cliModules/consoleDisplayer");
class RackspaceRemoteConfigurer {
    constructor(responsesFormatter, rackspaceLocalConfigurer) {
        this.containerRecords = [];
        this.responsesFormatter = responsesFormatter;
        this.rackspaceLocalConfigurer = rackspaceLocalConfigurer;
    }
    async getRemoteRecords(rackspacePath) {
        const { containerName, containerFolderName } = this.responsesFormatter.extractContainerAndFolderFromPath(rackspacePath);
        console.log(`swiftly get ${containerName} --prefix ${containerFolderName}`);
        return new Promise((resolve) => {
            child_process_1.exec(`swiftly get ${containerName} --prefix ${containerFolderName}`, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error(error || stderr);
                    throw new Error(`Sorry, but "swiftly" isn't installed on your PC or install incorrectly. Please install/reinstall it, using the provided link and try again: https://docs.rackspace.com/support/how-to/install-the-swiftly-client-for-cloud-files/. NOT AVAILABLE ON WINDOWS!`);
                }
                const formattedContainerRecords = this.responsesFormatter.formatContainerRecords(containerName, stdout);
                this.containerRecords = formattedContainerRecords || [];
                resolve(this.containerRecords);
            });
        });
    }
    async updateRemoteHeaders() {
        const { rackspaceCloudUrl, rackspaceToken } = this.rackspaceLocalConfigurer.currentConfig;
        await Promise.all(this.containerRecords.map(async (record) => {
            const response = await node_fetch_1.default(rackspaceCloudUrl + '/' + record, {
                method: 'POST',
                headers: {
                    'X-Auth-Token': rackspaceToken,
                    'Access-Control-Allow-Origin': '*',
                    'X-Object-Meta-Access-Control-Allow-Origin': '*'
                }
            });
            this.validateRackspaceResponse(await response.text());
        }));
    }
    validateRackspaceResponse(responseText) {
        const formattedResponse = this.responsesFormatter
            .formatRackspaceResponse(responseText)
            .toLocaleLowerCase();
        if (formattedResponse &&
            RackspaceRemoteConfigurer.validRackspaceResponseText !== formattedResponse) {
            throw new Error(`Rackspace responded with error: "${formattedResponse}"`);
        }
    }
    async updateRackspaceRecordsHeaders(rackspacePath) {
        try {
            consoleDisplayer_1.ConsoleDisplayer.displaySpinnerText('Fetching remote container records');
            await this.getRemoteRecords(rackspacePath);
            consoleDisplayer_1.ConsoleDisplayer.successSpinnerText('Fetched remote container records');
            consoleDisplayer_1.ConsoleDisplayer.displaySpinnerText('Updating remote records headers');
            await this.updateRemoteHeaders();
            consoleDisplayer_1.ConsoleDisplayer.successSpinnerText('Updated remote records headers');
            return true;
        }
        catch (error) {
            consoleDisplayer_1.ConsoleDisplayer.failSpinnerText(error.message);
            return false;
        }
    }
}
exports.RackspaceRemoteConfigurer = RackspaceRemoteConfigurer;
RackspaceRemoteConfigurer.validRackspaceResponseText = 'the request is accepted for processing.';
//# sourceMappingURL=rackspaceRemoteConfigurer.js.map