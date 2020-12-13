import { exec } from 'child_process';
import { ResponsesFormatter } from '../utils/responsesFormatter';
import { RackspaceLocalConfigurer } from './rackspaceLocalConfigurer';

interface RackspaceRemoteState {
  containerRecords: string[];
}

export class RackspaceRemoteConfigurer implements RackspaceRemoteState {
  containerRecords = [];
  responsesFormatter: ResponsesFormatter;
  rackspaceLocalConfigurer: RackspaceLocalConfigurer;

  constructor(
    responsesFormatter: ResponsesFormatter,
    rackspaceLocalConfigurer: RackspaceLocalConfigurer
  ) {
    this.responsesFormatter = responsesFormatter;
    this.rackspaceLocalConfigurer = rackspaceLocalConfigurer;
  }

  private async getRemoteRecords(
    rackspacePath: string
  ): Promise<string[] | undefined> {
    const {
      containerName,
      containerFolderName
    } = this.responsesFormatter.extractContainerAndFolderFromPath(
      rackspacePath
    );

    return new Promise((resolve, reject) => {
      exec(
        `swiftly get ${containerName} --prefix ${containerFolderName}`,
        (error, stdout, stderr) => {
          if (error) {
            reject(JSON.stringify(error, null, 2));
          } else if (stderr) {
            reject(stderr);
          }

          const formattedContainerRecords = this.responsesFormatter.formatContainerRecords(
            containerName,
            stdout
          );

          this.containerRecords = formattedContainerRecords || [];
          resolve(this.containerRecords);
        }
      );
    });
  }

  private async updateRemoteHeaders(): Promise<void> {
    const {
      rackspaceCloudUrl,
      rackspaceToken
    } = this.rackspaceLocalConfigurer.currentConfig;

    await Promise.all(
      this.containerRecords.map(async (record) => {
        await fetch(rackspaceCloudUrl + '/' + record, {
          method: 'POST',
          headers: {
            'X-Auth-Token': rackspaceToken,
            'Access-Control-Allow-Origin': '*',
            'X-Object-Meta-Access-Control-Allow-Origin': '*'
          }
        });
      })
    );
  }

  async updateRackspaceRecordsHeaders(rackspacePath: string): Promise<void> {
    await this.getRemoteRecords(rackspacePath);
    await this.updateRemoteHeaders();
  }
}
