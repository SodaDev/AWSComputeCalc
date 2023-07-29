import {api} from "./TypedFetch";
import {paths} from "./urls";
import fallback from "../fallback/apprunner.json"

export type AppRunnerPricing = {
    GBHour?: string
    vCPUHour?: string
    ProvisionedGBHour?: string
}

export type AppRunnerRegionalPricing = {
    regionPrices: Record<string, AppRunnerPricing>
}

async function downloadAppRunnerPrice(): Promise<AppRunnerRegionalPricing> {
    return await api.get(paths.appRunnnerUrl)
}

export function getAppRunnerFallback(): AppRunnerRegionalPricing {
    return fallback
}

export async function getAppRunnerPrice(): Promise<AppRunnerRegionalPricing> {
    try {
        return  await downloadAppRunnerPrice()
    } catch (e) {
        console.error(`Loading App Runner prices failed with ${e}`)
        return Promise.reject(e)
    }
}
