import { promises as fsPromises } from 'fs';
import path from 'path';

export interface RackspaceConfig {
  rackspaceCloudUrl: string;
  rackspaceToken: string;
}

export class RackspaceLocalConfigurer implements RackspaceConfig {
  private static readonly _rackspaceConfigPath = `${path.dirname(
    require.main.filename
  )}/../configs/rackspace-config.json`;

  rackspaceCloudUrl = '';
  rackspaceToken = '';

  get currentConfig(): RackspaceConfig {
    return {
      rackspaceCloudUrl: this.rackspaceCloudUrl,
      rackspaceToken: this.rackspaceToken
    };
  }

  async readRackspaceConfig(): Promise<RackspaceConfig> {
    try {
      await fsPromises.access(RackspaceLocalConfigurer._rackspaceConfigPath);
    } catch (err) {
      await this.createBlankRackspaceConfig();
      return;
    }

    const rackspaceConfig = await fsPromises.readFile(
      RackspaceLocalConfigurer._rackspaceConfigPath
    );
    const rackspaceConfigJson = JSON.parse(rackspaceConfig.toString());

    this.rackspaceCloudUrl = rackspaceConfigJson.rackspaceCloudUrl;
    this.rackspaceToken = rackspaceConfigJson.rackspaceToken;

    return rackspaceConfigJson;
  }

  private async createBlankRackspaceConfig(): Promise<void> {
    this.rackspaceCloudUrl = '';
    this.rackspaceToken = '';

    const initialRackspaceConfig = {
      ...this,
      rackspaceConfigPath: undefined
    } as RackspaceConfig;
    await fsPromises.writeFile(
      RackspaceLocalConfigurer._rackspaceConfigPath,
      JSON.stringify(initialRackspaceConfig, null, 2),
      {
        encoding: 'utf-8'
      }
    );
  }

  async writeRackspaceConfig(): Promise<void> {
    const rackspaceConfig = {
      ...this,
      rackspaceConfigPath: undefined
    } as RackspaceConfig;
    await fsPromises.writeFile(
      RackspaceLocalConfigurer._rackspaceConfigPath,
      JSON.stringify(rackspaceConfig, null, 2),
      {
        encoding: 'utf-8'
      }
    );
  }
}
