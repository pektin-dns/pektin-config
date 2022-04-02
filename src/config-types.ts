/* eslint-disable quotes */

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
 * The configuration for the Pektin DNS server
 */
export interface PektinConfig {
  services: {
    ui: {
      enabled: boolean;
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain: string;
    };
    api: {
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain: string;
    };
    vault: {
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain: string;
    };
    recursor: {
      enabled: boolean;
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain: string;
    };
    ribston: {
      enabled: boolean;
    };
    opa: {
      enabled: boolean;
    };
  };
  usePolicies: "ribston" | "opa" | "both" | false;
  nodes: [
    {
      main?: boolean;
      ips?: [string, ...string[]];
      legacyIps?: [string, ...string[]];
      name: string;
      ansible?: Hetzner;
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
      ansible?: Hetzner;
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
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain?: string;
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      node: string;
      main?: boolean;
    },
    ...{
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain?: string;
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      node: string;
      main?: boolean;
    }[]
  ];
  letsencrypt: {
    enabled: boolean;
    /**
     * A valid email address
     */
    letsencryptEmail: string;
  };
  build: {
    server: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
    api: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
    ui: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
    ribston: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
    recursor: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
    vault: {
      enabled: boolean;
      path: string;
      dockerfile: string;
    };
  };
  reverseProxy: {
    routing: "local" | "domain" | "minikube";
    tempZone: {
      enabled: boolean;
      /**
       * Get a temporary subdomain for an easy and secure access while your domain changes still propagate. This subdomain will exist for 7 days, will then be deleted and not be recoverable afterwards. For pektin.zone. this implies your acceptance of our privacy policy.
       */
      provider: string;
      routing: "local" | "public";
    };
    tls: boolean;
    createTraefik: boolean;
    traefikUi: {
      enabled: boolean;
      domain: string;
      subDomain: string;
    };
    /**
     * Proxy to external APIs that aren't configured to use CORS.
     */
    external: {
      enabled: boolean;
      /**
       * A valid UTF8 domain name
       */
      domain: string;
      /**
       * A valid UTF8 domain name not ending with a dot
       */
      subDomain: string;
      services: {
        enabled: boolean;
        name: string;
        domain: string;
        accessControlAllowMethods: string[];
      }[];
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
