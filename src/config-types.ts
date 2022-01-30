/* eslint-disable quotes */

export type AnsibleConfig = Hetzner;
export type AnsibleConfigType = "hetzner";
export type HetznerServerType =
  | "cx11"
  | "cpx11"
  | "cx21"
  | "cpx21"
  | "cx31"
  | "cpx31"
  | "cx41"
  | "cpx41"
  | "cx51"
  | "cpx51";

export interface PektinConfig {
  ui: {
    enabled: boolean;
    domain: string;
    subDomain: string;
  };
  api: {
    enabled: boolean;
    domain: string;
    subDomain: string;
  };
  vault: {
    enabled: boolean;
    domain: string;
    subDomain: string;
  };
  recursor: {
    enabled: boolean;
    domain: string;
    subDomain: string;
  };
  nodes: [
    {
      main?: boolean;
      ips?: [string, ...string[]];
      legacyIps?: [string, ...string[]];
      name: string;
      ansible?: AnsibleConfig;
      setup?: {
        system: string;
        root: {
          disableSystemdResolved: boolean;
          installDocker: boolean;
        };
        cloneRepo: boolean;
        setup: boolean;
        start: boolean;
      };
    },
    ...{
      main?: boolean;
      ips?: [string, ...string[]];
      legacyIps?: [string, ...string[]];
      name: string;
      ansible?: AnsibleConfig;
      setup?: {
        system: string;
        root: {
          disableSystemdResolved: boolean;
          installDocker: boolean;
        };
        cloneRepo: boolean;
        setup: boolean;
        start: boolean;
      };
    }[]
  ];
  nameservers: [
    {
      subDomain?: string;
      domain: string;
      node: string;
      main?: boolean;
    }
  ];
  registrarApi: {
    enabled: boolean;
    registrars?: [
      {
        type: "gandi";
        domains: [string, ...string[]];
        dataPath: string;
      },
      ...{
        type: "gandi";
        domains: [string, ...string[]];
        dataPath: string;
      }[]
    ];
    [k: string]: unknown;
  };
  certificates: {
    enabled: boolean;
    letsencryptEmail: string;
  };
  reverseProxy: {
    createTraefik: boolean;
    applyTraefikConfig: boolean;
  };
  build: {
    server: {
      enabled: boolean;
      path: string;
    };
    api: {
      enabled: boolean;
      path: string;
    };
    ui: {
      enabled: boolean;
      path: string;
    };
  };
  devmode: {
    enabled: boolean;
    type: "local" | "insecure-online";
  };
  ansible?: {
    sshPubKeyName: string;
  };
}
export interface Hetzner {
  configType: AnsibleConfigType;
  floatingIp?: boolean;
  floatingLegacyIp?: boolean;
  location?: "nbg1" | "fsn1";
  serverType?: HetznerServerType;
}
