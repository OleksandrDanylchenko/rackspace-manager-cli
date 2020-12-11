import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import {
  RackspaceConfig,
  RackspaceIOConfigHelper
} from './utils/rackspaceIOConfig.helper';
import { promptConsoleArguments, promptConsoleValue } from './utils/io.helper';

clear();
console.log(
  chalk.yellow(
    figlet.textSync('UPDATER', {
      font: 'Bloody',
      horizontalLayout: 'full'
    })
  )
);

const rackspaceConfigHelper = new RackspaceIOConfigHelper();

rackspaceConfigHelper
  .readRackspaceConfig()
  .then(async (rackspaceConfig: RackspaceConfig) => {
    const args = promptConsoleArguments();

    let isUpdated = false;
    if (!rackspaceConfig.rackspaceCloudUrl && !args.cloudUrl) {
      rackspaceConfigHelper.rackspaceCloudUrl = await promptConsoleValue(
        'Please provide a rackspace cloud public url: '
      );
      isUpdated = true;
    }
    if (!rackspaceConfig.rackspaceToken && !args.token) {
      rackspaceConfigHelper.rackspaceToken = await promptConsoleValue(
        'Please provide a rackspace token id: '
      );
      isUpdated = true;
    }

    if (isUpdated) {
      await rackspaceConfigHelper.writeRackspaceConfig();
    }
  })
  .catch((err) => console.error(err));
