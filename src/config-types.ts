/* eslint-disable quotes */

/**
 * A valid UTF8 absolute domain name ending with a dot
 */
export type DomainName = string;
/**
 * A valid UTF8 domain name not ending with a dot
 */
export type SubDomain = string;
/**
 * A valid ip(ipv6) address
 */
export type Ip = string;
/**
 * A valid legacyIp(ipv4) address
 */
export type LegacyIp = string;
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
export type SupportedRegistrars = "gandi";
/**
 * A valid email address
 */
export type Email = string;

export interface PektinConfig {
  ui: {
    enabled: boolean;
    domain: DomainName;
    subDomain: SubDomain;
  };
  api: {
    enabled: boolean;
    domain: DomainName;
    subDomain: SubDomain;
  };
  vault: {
    enabled: boolean;
    domain: DomainName;
    subDomain: SubDomain;
  };
  recursor: {
    enabled: boolean;
    domain: DomainName;
    subDomain: SubDomain;
  };
  nodes: [
    {
      main?: boolean;
      ips?: [Ip, ...Ip[]];
      legacyIps?: [LegacyIp, ...LegacyIp[]];
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
      ips?: [Ip, ...Ip[]];
      legacyIps?: [LegacyIp, ...LegacyIp[]];
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
      subDomain?: SubDomain;
      domain: DomainName;
      node: string;
      main?: boolean;
    },
    ...{
      subDomain?: SubDomain;
      domain: DomainName;
      node: string;
      main?: boolean;
    }[]
  ];
  registrarApi: {
    enabled: boolean;
    registrars?: [
      {
        type: SupportedRegistrars;
        domains: [DomainName, ...DomainName[]];
        dataPath: string;
      },
      ...{
        type: SupportedRegistrars;
        domains: [DomainName, ...DomainName[]];
        dataPath: string;
      }[]
    ];
    [k: string]: unknown;
  };
  certificates: {
    enabled: boolean;
    letsencryptEmail: Email;
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
