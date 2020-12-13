"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponsesFormatter = void 0;
class ResponsesFormatter {
    constructor() {
        this.extractContainerAndFolderFromPath = (rackspacePath) => {
            const containerDelimiterIndex = rackspacePath.indexOf('/');
            const containerName = rackspacePath.substring(0, containerDelimiterIndex);
            const containerFolderName = rackspacePath.substring(containerDelimiterIndex + 1);
            return { containerName, containerFolderName };
        };
        this.formatContainerRecords = (containerName, records) => {
            const splittedContainerRecords = records.split('\n');
            return splittedContainerRecords.map((record) => containerName + '/' + record);
        };
        this.formatRackspaceResponse = (response) => {
            const responseTextRegex = /<p>(.*)<\/p>/i;
            const responseText = responseTextRegex.exec(response);
            return !responseText ? '' : responseText[1].toLowerCase();
        };
    }
}
exports.ResponsesFormatter = ResponsesFormatter;
//# sourceMappingURL=responsesFormatter.js.map