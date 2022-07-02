import {api} from "./TypedFetch";
import {paths} from "./urls";
import ec2Fallback from "../fallback/ec2.json"

export type EC2InstanceTypePricing = {
    InstanceType: string;
    Memory: string;
    VCPUS: number;
    Storage: string;
    Network: string;
    Cost: number;
    MonthlyPrice: number;
    SpotPrice: string;
}

export type EC2ShopPricing = {
    Prices: EC2InstanceTypePricing[];
}

export type EC2InstancePricing = {
    instancePrices: Record<string, EC2InstanceTypePricing>
}

async function downloadEc2Price(): Promise<EC2ShopPricing> {
    return await api.get(paths.ec2Url, {
        mode: "no-cors",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    })
}

function groupByInstanceType(response: EC2ShopPricing): Record<string, EC2InstanceTypePricing> {
    const perInstanceType: Record<string, EC2InstanceTypePricing> = {}
    for (let price of response.Prices) {
        perInstanceType[price.InstanceType] =  price
    }
    return perInstanceType
}

export function getEc2Fallback(): EC2InstancePricing {
    return {
        instancePrices: groupByInstanceType(ec2Fallback)
    }
}

export async function getEc2Price(): Promise<EC2InstancePricing> {
    const response = await downloadEc2Price()
    return {
        instancePrices: groupByInstanceType(response)
    }
}