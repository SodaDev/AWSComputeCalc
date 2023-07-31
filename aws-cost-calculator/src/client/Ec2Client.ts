import {api} from "./TypedFetch";
import {paths} from "./urls";
import ec2Fallback from "../fallback/ec2.json"

export type EC2PricingResponse = {
    pricing: Record<string, EC2OSPricing>
    updated: string
}

export type EC2OSPricing = {
    Windows?: OSPricing;
    Linux?:   OSPricing;
}

export interface OSPricing {
    product:         EC2InstanceConfiguration;
    onDemandPricing?: string;
    reservedPricing?: ReservedPricing;
    spotPricing?:     string;
}

export interface EC2InstanceConfiguration {
    instanceType?: string;
    vcpu?:         string;
    memory?:       string;
}

export interface ReservedPricing {
    standard?:    ReservedDealPricing;
    convertible?: ReservedDealPricing;
}

export interface ReservedDealPricing {
    "3yr"?: string;
    "1yr"?: string;
}

export type EC2InstancePricing = {
    instancePrices: Record<string, EC2OSPricing>
}

async function downloadEc2Price(): Promise<EC2InstancePricing> {
    const ec2Pricing: EC2PricingResponse = await api.get(paths.ec2Url);
    return {
        instancePrices: ec2Pricing.pricing
    }
}

export function getEc2Fallback(): EC2InstancePricing {
    return {
        instancePrices: ec2Fallback.pricing
    }
}

export async function getEc2Price(): Promise<EC2InstancePricing> {
    return await downloadEc2Price()
}