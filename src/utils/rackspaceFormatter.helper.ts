export const extractRackspaceRequestParams = (
  rackspacePath: string
): { containerName: string; containerFolderName: string } => {
  const containerDelimiterIndex = rackspacePath.indexOf('/');
  const containerName = rackspacePath.substring(0, containerDelimiterIndex);
  const containerFolderName = rackspacePath.substring(
    containerDelimiterIndex + 1
  );
  return { containerName, containerFolderName };
};

export const formatContainerRecords = (
  containerName: string,
  records: string
): string[] => {
  const splittedContainerRecords = records.split('\n');
  return splittedContainerRecords.map((record) => containerName + '/' + record);
};

export const formatRackspaceResponse = (response: string): string => {
  const responseTextRegex = /<h1>(.*)<\/h1>/i;

  const responseText = responseTextRegex.exec(response);

  if (!responseText) return 'accepted';
  else return responseText[1].toLowerCase();
};
