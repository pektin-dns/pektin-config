export interface FloatingIpResponse {
    changed: boolean;
    skipped?: boolean;
    skip_reason?: string;
    hcloud_floating_ip?: {
        id: string;
        name: string;
        description: string;
        ip: string;
        type: string;
        home_location: string;
        labels: { group: "main" | "sub" };
        server: string;
        delete_protection: boolean;
    };
    failed?: boolean;
}
