// This file extends the AdapterConfig type from "@types/iobroker"

// Augment the globally declared type ioBroker.AdapterConfig
declare global {
    namespace ioBroker {
        interface AdapterConfig {
            option1: boolean;
            option2: string;
            GENEREL_default_timout: number;
            MIIO_login1: string;
            MIIO_password1: string;
            MIIO_country1: string;
            MIIO_login2: string;
            MIIO_password2: string;
            MIIO_country2: string;
            MIIO_autoRefresh: boolean;
            MIIO_autoRefreshTimeout: number;
            MIIO_activatedConfig1: boolean;
            MIIO_activatedConfig2: boolean;
        }
    }
}

// this is required so the above AdapterConfig is found by TypeScript / type checking
export {};
