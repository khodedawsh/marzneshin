import { NodeType } from "@marzneshin/features/nodes";

export type ProtocolType = 'vmess' | 'vless' | 'trojan' | 'shadowsocks';

export interface InboundType {
    id: number;
    tag: string;
    protocol: ProtocolType;
    network: string;
    node: NodeType;
    tls: string;
    port?: number;
}

export type Inbounds = InboundType[];
