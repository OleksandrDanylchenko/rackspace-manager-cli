import { exec } from 'child_process';
import { RackspaceConfig } from '../utils/rackspaceIOConfig.helper';
import {
  extractRackspaceRequestParams,
  formatContainerRecords,
  formatRackspaceResponse
} from '../utils/rackspaceFormatter.helper';

interface RackspaceRemoteState {
  containerRecords: string[];
}

class RackspaceRemoteService implements RackspaceRemoteState {
  containerRecords = [];

  private getRackspacePathRecords = async (
    rackspacePath: string
  ): Promise<string[] | undefined> => {
    const {
      containerName,
      containerFolderName
    } = extractRackspaceRequestParams(rackspacePath);

    return new Promise((resolve, reject) => {
      exec(
        `swiftly get ${containerName} --prefix ${containerFolderName}`,
        (error, stdout, stderr) => {
          if (error) {
            reject(JSON.stringify(error, null, 2));
          }
          if (stderr) {
            reject(stderr);
          }

          resolve(formatContainerRecords(containerName, stdout));
        }
      );
    });
  };

  private validateRackspaceResponse = (responseText: string): void => {
    const responseFormatted = formatRackspaceResponse(responseText);
    if (responseFormatted !== 'accepted') {
      throw new Error("Rackspace didn't accept update");
    }
  };

  private updateRackspaceContainerRecordsHeaders = async (
    containerRecordsList: string[],
    rackspaceConfig: RackspaceConfig
  ): Promise<void> => {
    await Promise.all(
      containerRecordsList.map(async (record) => {
        const response = await fetch(
          rackspaceConfig.rackspaceCloudUrl + '/' + record,
          {
            method: 'POST',
            headers: {
              'X-Auth-Token': rackspaceConfig.rackspaceToken,
              'Access-Control-Allow-Origin': '*',
              'X-Object-Meta-Access-Control-Allow-Origin': '*'
            }
          }
        );
        this.validateRackspaceResponse(await response.text());
      })
    );
  };

  updateContainerRecordsHeaders = async (
    rackspacePath: string,
    rackspaceConfig: RackspaceConfig
  ): Promise<string[] | void> => {
    const containerRecordsList =
      (await this.getRackspacePathRecords(rackspacePath)) || [];
    await this.updateRackspaceContainerRecordsHeaders(
      containerRecordsList,
      rackspaceConfig
    );
  };
}
