declare namespace NodeJS {
  export interface ProcessEnv {
    readonly ENV_VARIABLE: string;
    readonly MOLLIE_API_KEY: string;
    readonly MOLLIE_LIVE_API_KEY: string;
    readonly DOMAIN: string;
    readonly GOOGLE_CLIENT_ID: string;
    readonly GOOGLE_CLIENT_SECRET: string;
    readonly AUTH_SECRET: string;
  }
}