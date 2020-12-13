export class ResponsesFormatter {
  extractContainerAndFolderFromPath = (
    rackspacePath: string
  ): { containerName: string; containerFolderName: string } => {
    const containerDelimiterIndex = rackspacePath.indexOf('/');
    const containerName = rackspacePath.substring(0, containerDelimiterIndex);
    const containerFolderName = rackspacePath.substring(
      containerDelimiterIndex + 1
    );
    return { containerName, containerFolderName };
  };

  formatContainerRecords = (
    containerName: string,
    records: string
  ): string[] => {
    const splittedContainerRecords = records.split('\n');
    return splittedContainerRecords.map(
      (record) => containerName + '/' + record
    );
  };

  formatRackspaceResponse = (response: string): string => {
    const responseTextRegex = /<p>(.*)<\/p>/i;
    const responseText = responseTextRegex.exec(response);
    return !responseText ? '' : responseText[1].toLowerCase();
  };
}
