export class FargateConfig {
    vCPU: number
    memory: number

    constructor(vCPU: number, memory: number) {
        this.vCPU = vCPU;
        this.memory = memory;
    }

    get label(): string {
        return `${this.vCPU}vCpu - ${this.memory} GB`;
    }
}

function generateSetup(vCPU: number, from: number, to: number): FargateConfig[] {
    return Array.from(Array(to - from + 1).keys())
        .map(x => new FargateConfig(vCPU, x + from))
}

export function buildFargateConfigs(): FargateConfig[] {
    return [
        new FargateConfig(0.25, 0.5),
        new FargateConfig(0.25, 1),
        new FargateConfig(0.25, 2)
    ].concat(generateSetup(0.5, 1, 4))
        .concat(generateSetup(1, 2, 8))
        .concat(generateSetup(2, 4, 16))
        .concat(generateSetup(4, 8, 30))
}

const appRunnerConfigs: FargateConfig[] = [
    new FargateConfig(0.25, 0.5),
    new FargateConfig(0.25, 1),
    new FargateConfig(0.5, 1),
    new FargateConfig(1, 2),
    new FargateConfig(1, 3),
    new FargateConfig(1, 4),
    new FargateConfig(2, 4),
    new FargateConfig(2, 6),
    new FargateConfig(4, 8),
    new FargateConfig(4, 10),
    new FargateConfig(4, 12)
]

export function isAppRunnerEnabled(fargateConfig: FargateConfig) {
    return appRunnerConfigs.find(x => x.vCPU === fargateConfig.vCPU && x.memory === fargateConfig.memory) !== undefined
}
