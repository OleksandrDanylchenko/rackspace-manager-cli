import { ConsoleDisplayer } from './cliModules/consoleDisplayer';
import {
  RackspaceConfig,
  RackspaceLocalConfigurer
} from './rackspaceModules/rackspaceLocalConfigurer';
import { ConsolePrompter } from './cliModules/consolePrompter';
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
    ConsoleDisplayer.successSpinnerText();

    const args = consolePrompter.getConsoleArguments();

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

    if (isUpdated) {
      ConsoleDisplayer.displaySpinnerText('Updating local configuration');
      await rackspaceLocalConfigurer.writeRackspaceConfig();
      ConsoleDisplayer.successSpinnerText();
    }

    const isRackspaceUpdated = await rackspaceRemoteConfigurer.updateRackspaceRecordsHeaders(
      args['container-path']
    );

    process.exit(isRackspaceUpdated ? 0 : 401);
  })
  .catch((err) => ConsoleDisplayer.failSpinnerText(err));
