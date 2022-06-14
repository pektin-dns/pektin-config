/* eslint-disable quotes */

/**
 * The secrets to be provided to the Pektin UI
 */
export interface PektinClientConnectionConfig {
  username: string;
  managerPassword?: string;
  confidantPassword?: string;
  vaultEndpoint?: string;
  perimeterAuth?: string;
  internal?: boolean;
  override?: {
    pektinApiEndpoint?: string;
    pektinConfig?: {
      [k: string]: unknown;
    };
  };
  info?: {
    apiCredentials?: {
      [k: string]: unknown;
    };
  };
}
