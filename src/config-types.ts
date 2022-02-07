/* eslint-disable quotes */

/**
 * A valid UTF8 domain name
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
/**
 * A valid email address
 */
export type Email = string;

export interface PektinConfig {
  services: {
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
  certificates: {
    enabled: boolean;
    letsencryptEmail: Email;
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
  reverseProxy: {
    routing: "local" | "domain";
    /**
     * Get a temporary pektin zone subdomain for an easy and secure access while your domain changes still propagate. This subdomain will exist for 7 days, will then be deleted and not be recoverable afterwards. Setting this to true implies your acceptance of our privacy policy.
     */
    tempPektinZone: boolean;
    tls: boolean;
    useLegacyIp: boolean;
    createTraefik: boolean;
    external: {
      enabled: boolean;
      domain: DomainName;
      subDomain: SubDomain;
      services: {
        gandi: boolean;
        crt: boolean;
      };
    };
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
