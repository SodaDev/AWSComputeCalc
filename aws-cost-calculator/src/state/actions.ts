type Action =
    {type: "set RPM", amount: number}
    | {type: "set daily", amount: number}
    | {type: "set monthly", amount: number}

export type { Action };