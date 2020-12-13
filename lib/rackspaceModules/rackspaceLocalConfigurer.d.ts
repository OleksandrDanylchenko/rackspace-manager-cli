export interface RackspaceConfig {
    rackspaceCloudUrl: string;
    rackspaceToken: string;
}
export declare class RackspaceLocalConfigurer implements RackspaceConfig {
    private static readonly _rackspaceConfigPath;
    rackspaceCloudUrl: string;
    rackspaceToken: string;
    get currentConfig(): RackspaceConfig;
    readRackspaceConfig(): Promise<RackspaceConfig>;
    private createBlankRackspaceConfig;
    writeRackspaceConfig(): Promise<void>;
}
