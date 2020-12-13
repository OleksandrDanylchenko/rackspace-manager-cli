export declare class ResponsesFormatter {
    extractContainerAndFolderFromPath: (rackspacePath: string) => {
        containerName: string;
        containerFolderName: string;
    };
    formatContainerRecords: (containerName: string, records: string) => string[];
    formatRackspaceResponse: (response: string) => string;
}
