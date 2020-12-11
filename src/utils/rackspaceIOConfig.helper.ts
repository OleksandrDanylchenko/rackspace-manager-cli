import { promises as fsPromises } from 'fs';
import path from 'path';

export interface RackspaceConfig {
  rackspaceCloudUrl: string;
  rackspaceToken: string;
}

export class RackspaceIOConfigHelper implements RackspaceConfig {
  readonly rackspaceConfigPath = `${path.dirname(
    require.main.filename
  )}/../configs/rackspace-config.json`;

  rackspaceCloudUrl = '';
  rackspaceToken = '';

  readRackspaceConfig = async (): Promise<RackspaceConfig> => {
    try {
      await fsPromises.access(this.rackspaceConfigPath);
    } catch (err) {
      await this.createBlankRackspaceConfig();
      return;
    }

    const rackspaceConfig = await fsPromises.readFile(this.rackspaceConfigPath);
    const rackspaceConfigJson = JSON.parse(rackspaceConfig.toString());

    this.rackspaceCloudUrl = rackspaceConfigJson.rackspaceCloudUrl;
    this.rackspaceToken = rackspaceConfigJson.rackspaceToken;

    return rackspaceConfigJson;
  };

  private createBlankRackspaceConfig = async (): Promise<void> => {
    this.rackspaceCloudUrl = '';
    this.rackspaceToken = '';

    const initialRackspaceConfig = {
      ...this,
      rackspaceConfigPath: undefined
    } as RackspaceConfig;
    await fsPromises.writeFile(
      this.rackspaceConfigPath,
      JSON.stringify(initialRackspaceConfig, null, 2),
      {
        encoding: 'utf-8'
      }
    );
  };

  writeRackspaceConfig = async (): Promise<void> => {
    const rackspaceConfig = {
      ...this,
      rackspaceConfigPath: undefined
    } as RackspaceConfig;
    await fsPromises.writeFile(
      this.rackspaceConfigPath,
      JSON.stringify(rackspaceConfig, null, 2),
      {
        encoding: 'utf-8'
      }
    );
  };
}
