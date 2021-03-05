import { exec } from 'child_process';
import { ResponsesFormatter } from '../utils/responsesFormatter';
import { RackspaceLocalConfigurer } from './rackspaceLocalConfigurer';
import fetch from 'node-fetch';
import { ConsoleDisplayer } from '../cliModules/consoleDisplayer';

interface RackspaceRemoteState {
  containerRecords: string[];
}

export class RackspaceRemoteConfigurer implements RackspaceRemoteState {
  containerRecords = [];
  private responsesFormatter: ResponsesFormatter;
  private rackspaceLocalConfigurer: RackspaceLocalConfigurer;

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

    return new Promise((resolve) => {
      console.log(
        `swiftly get ${containerName} --prefix ${containerFolderName}`
      );

      exec(
        `swiftly get ${containerName} --prefix ${containerFolderName}`,
        (error, stdout, stderr) => {
          if (error || stderr) {
            throw new Error(
              `Sorry, but "swiftly" isn't installed on your PC or install incorrectly. Please install/reinstall it, using the provided link and try again: https://docs.rackspace.com/support/how-to/install-the-swiftly-client-for-cloud-files/. NOT AVAILABLE ON WINDOWS!`
            );
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
        const response = await fetch(rackspaceCloudUrl + '/' + record, {
          method: 'POST',
          headers: {
            'X-Auth-Token': rackspaceToken,
            'Access-Control-Allow-Origin': '*',
            'X-Object-Meta-Access-Control-Allow-Origin': '*'
          }
        });

        this.validateRackspaceResponse(await response.text());
      })
    );
  }

  private static readonly validRackspaceResponseText =
    'the request is accepted for processing.';
  private validateRackspaceResponse(responseText: string): void {
    const formattedResponse = this.responsesFormatter
      .formatRackspaceResponse(responseText)
      .toLocaleLowerCase();

    if (
      formattedResponse &&
      RackspaceRemoteConfigurer.validRackspaceResponseText !== formattedResponse
    ) {
      throw new Error(`Rackspace responded with error: "${formattedResponse}"`);
    }
  }

  async updateRackspaceRecordsHeaders(rackspacePath: string): Promise<boolean> {
    try {
      ConsoleDisplayer.displaySpinnerText('Fetching remote container records');
      await this.getRemoteRecords(rackspacePath);
      ConsoleDisplayer.successSpinnerText('Fetched remote container records');

      ConsoleDisplayer.displaySpinnerText('Updating remote records headers');
      await this.updateRemoteHeaders();
      ConsoleDisplayer.successSpinnerText('Updated remote records headers');
      return true;
    } catch (error) {
      ConsoleDisplayer.failSpinnerText(error.message);
      return false;
    }
  }
}
