declare module '@deriv/deriv-charts' {
    export function setSmartChartsPublicPath(path: string): void;
    
    export interface SmartChartProps {
        id: string;
        barriers?: any[];
        chartControlsWidgets?: React.ReactNode;
        enabledChartFooter?: boolean;
        chartStatusListener?: (status: boolean) => void;
        toolbarWidget?: () => React.ReactNode;
        chartType?: string;
        isMobile?: boolean;
        enabledNavigationWidget?: boolean;
        granularity?: number;
        requestAPI?: (request: any) => Promise<any>;
        requestForget?: () => void;
        requestForgetStream?: () => void;
        requestSubscribe?: (request: any, callback: (response: any) => void) => void;
        settings?: {
            assetInformation?: boolean;
            countdown?: boolean;
            isHighestLowestMarkerEnabled?: boolean;
            language?: string;
            position?: string;
            theme?: string;
        };
        symbol?: string;
        topWidgets?: () => React.ReactNode;
        isConnectionOpened?: boolean;
        isLive?: boolean;
    }

    export const SmartChart: React.FC<SmartChartProps>;
    
    export interface ChartTitleProps {
        onChange: (symbol: string) => void;
    }
    
    export const ChartTitle: React.FC<ChartTitleProps>;
}
