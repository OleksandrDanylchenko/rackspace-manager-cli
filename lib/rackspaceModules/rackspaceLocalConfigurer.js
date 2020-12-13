"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RackspaceLocalConfigurer = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
class RackspaceLocalConfigurer {
    constructor() {
        this.rackspaceCloudUrl = '';
        this.rackspaceToken = '';
    }
    get currentConfig() {
        return {
            rackspaceCloudUrl: this.rackspaceCloudUrl,
            rackspaceToken: this.rackspaceToken
        };
    }
    async readRackspaceConfig() {
        try {
            await fs_1.promises.access(RackspaceLocalConfigurer._rackspaceConfigPath);
        }
        catch (err) {
            await this.createBlankRackspaceConfig();
            return this.currentConfig;
        }
        const rackspaceConfig = await fs_1.promises.readFile(RackspaceLocalConfigurer._rackspaceConfigPath);
        const rackspaceConfigJson = JSON.parse(rackspaceConfig.toString());
        this.rackspaceCloudUrl = rackspaceConfigJson.rackspaceCloudUrl;
        this.rackspaceToken = rackspaceConfigJson.rackspaceToken;
        return this.currentConfig;
    }
    async createBlankRackspaceConfig() {
        this.rackspaceCloudUrl = '';
        this.rackspaceToken = '';
        const initialRackspaceConfig = {
            ...this,
            rackspaceConfigPath: undefined
        };
        await createConfigFolder();
        await createConfigFile(initialRackspaceConfig);
        function createConfigFolder() {
            const rackspaceConfigFolder = RackspaceLocalConfigurer._rackspaceConfigPath.replace('rackspace-config.json', '');
            return fs_1.promises.mkdir(rackspaceConfigFolder, { recursive: true });
        }
        function createConfigFile(initialRackspaceConfig) {
            return fs_1.promises.writeFile(RackspaceLocalConfigurer._rackspaceConfigPath, JSON.stringify(initialRackspaceConfig, null, 2), {
                encoding: 'utf-8'
            });
        }
    }
    async writeRackspaceConfig() {
        const rackspaceConfig = {
            ...this,
            rackspaceConfigPath: undefined
        };
        await fs_1.promises.writeFile(RackspaceLocalConfigurer._rackspaceConfigPath, JSON.stringify(rackspaceConfig, null, 2), {
            encoding: 'utf-8'
        });
    }
}
exports.RackspaceLocalConfigurer = RackspaceLocalConfigurer;
RackspaceLocalConfigurer._rackspaceConfigPath = `${path_1.default.dirname(require.main.filename)}/../configs/rackspace-config.json`;
//# sourceMappingURL=rackspaceLocalConfigurer.js.map