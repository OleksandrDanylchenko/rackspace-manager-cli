#!/usr/bin/env node

import { ConsoleDisplayer } from './cliModules/consoleDisplayer';
import {
  RackspaceConfig,
  RackspaceLocalConfigurer
} from './rackspaceModules/rackspaceLocalConfigurer';
import { ConsolePrompter, YargsOptions } from './cliModules/consolePrompter';
import { RackspaceRemoteConfigurer } from './rackspaceModules/rackspaceRemoteConfigurer';
import { ResponsesFormatter } from './utils/responsesFormatter';

const consolePrompter = new ConsolePrompter();

const rackspaceLocalConfigurer = new RackspaceLocalConfigurer();
const responsesFormatter = new ResponsesFormatter();
const rackspaceRemoteConfigurer = new RackspaceRemoteConfigurer(
  responsesFormatter,
  rackspaceLocalConfigurer
);

ConsoleDisplayer.clearScreen();
ConsoleDisplayer.displayAppHeader();

ConsoleDisplayer.displaySpinnerText('Fetching local configuration');
rackspaceLocalConfigurer
  .readRackspaceConfig()
  .then(async (rackspaceConfig: RackspaceConfig) => {
    ConsoleDisplayer.successSpinnerText(
      `Fetched local configuration: ${JSON.stringify(
        { ...rackspaceConfig },
        null,
        2
      )}`
    );

    const args = consolePrompter.getConsoleArguments();
    await readCliArgsAndUpdateConfig(args, rackspaceConfig);

    const isRackspaceUpdated = await rackspaceRemoteConfigurer.updateRackspaceRecordsHeaders(
      args['container-path']
    );

    process.exit(isRackspaceUpdated ? 0 : 401);
  })
  .catch((err) => ConsoleDisplayer.failSpinnerText(err));

async function readCliArgsAndUpdateConfig(
  args: YargsOptions,
  rackspaceConfig: RackspaceConfig
): Promise<void> {
  let isUpdated = false;
  if (!rackspaceConfig.rackspaceCloudUrl && !args['cloud-url']) {
    rackspaceLocalConfigurer.rackspaceCloudUrl = await consolePrompter.promptConsoleValue(
      'Please provide a rackspace cloud public url: '
    );
    isUpdated = true;
  }
  if (!rackspaceConfig.rackspaceToken && !args['token']) {
    rackspaceLocalConfigurer.rackspaceToken = await consolePrompter.promptConsoleValue(
      'Please provide a rackspace token id: '
    );
    isUpdated = true;
  }
  if (args['cloud-url']) {
    rackspaceLocalConfigurer.rackspaceCloudUrl = args['cloud-url'];
    isUpdated = true;
  }
  if (args['token']) {
    rackspaceLocalConfigurer.rackspaceToken = args['token'];
    isUpdated = true;
  }

  if (isUpdated) {
    ConsoleDisplayer.displaySpinnerText('Updating local configuration');
    await rackspaceLocalConfigurer.writeRackspaceConfig();
    ConsoleDisplayer.successSpinnerText('Updated local configuration');
  }
}
