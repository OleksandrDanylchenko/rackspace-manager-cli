import { ResponsesFormatter } from '../utils/responsesFormatter';
import { RackspaceLocalConfigurer } from './rackspaceLocalConfigurer';
interface RackspaceRemoteState {
    containerRecords: string[];
}
export declare class RackspaceRemoteConfigurer implements RackspaceRemoteState {
    containerRecords: any[];
    private responsesFormatter;
    private rackspaceLocalConfigurer;
    constructor(responsesFormatter: ResponsesFormatter, rackspaceLocalConfigurer: RackspaceLocalConfigurer);
    private getRemoteRecords;
    private updateRemoteHeaders;
    private static readonly validRackspaceResponseText;
    private validateRackspaceResponse;
    updateRackspaceRecordsHeaders(rackspacePath: string): Promise<boolean>;
}
export {};
