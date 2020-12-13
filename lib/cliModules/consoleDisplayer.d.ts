import { Ora } from 'ora';
export declare class ConsoleDisplayer {
    private static spinner;
    static clearScreen: () => void;
    static displayAppHeader: () => void;
    static displaySpinnerText: (spinnerText: string) => void;
    static successSpinnerText: (successSpinnerText?: string) => Ora;
    static failSpinnerText: (failSpinnerText?: string) => Ora;
}
