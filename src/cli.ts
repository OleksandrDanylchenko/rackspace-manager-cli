import { ConsoleDisplayer } from './cliModules/consoleDisplayer';
import {
  RackspaceConfig,
  RackspaceLocalConfigurer
} from './rackspaceModules/rackspaceLocalConfigurer';
import { ConsolePrompter } from './cliModules/consolePrompter';

const consoleDisplayer = new ConsoleDisplayer();
const consolePrompter = new ConsolePrompter();
const rackspaceLocalConfigurer = new RackspaceLocalConfigurer();

consoleDisplayer.clearScreen();
consoleDisplayer.displayAppHeader();

rackspaceLocalConfigurer
  .readRackspaceConfig()
  .then(async (rackspaceConfig: RackspaceConfig) => {
    const args = consolePrompter.promptConsoleArguments();

    let isUpdated = false;
    if (!rackspaceConfig.rackspaceCloudUrl && !args.cloudUrl) {
      rackspaceLocalConfigurer.rackspaceCloudUrl = await consolePrompter.promptConsoleValue(
        'Please provide a rackspace cloud public url: '
      );
      isUpdated = true;
    }
    if (!rackspaceConfig.rackspaceToken && !args.token) {
      rackspaceLocalConfigurer.rackspaceToken = await consolePrompter.promptConsoleValue(
        'Please provide a rackspace token id: '
      );
      isUpdated = true;
    }

    if (isUpdated) {
      await rackspaceLocalConfigurer.writeRackspaceConfig();
    }
  })
  .catch((err) => console.error(err));
