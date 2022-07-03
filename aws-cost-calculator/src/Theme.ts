import {createTheme} from "@mui/material";
import {orange, purple} from "@mui/material/colors";

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            danger?: string;
        };
    }
}

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff9900',
        },
        secondary: {
            main: '#18dbab',
        },
        background: {
            default: '#131a22',
            paper: '#131a22',
        },
    },
});

export const chartTheme = {
    "background": "#131a22",
    "textColor": "#dddddd",
    "fontSize": 11,
    "axis": {
        "domain": {
            "line": {
                "stroke": "#dddddd",
                "strokeWidth": 1
            }
        },
        "legend": {
            "text": {
                "fontSize": 12,
                "fill": "#dddddd"
            }
        },
        "ticks": {
            "line": {
                "stroke": "#777777",
                "strokeWidth": 1
            },
            "text": {
                "fontSize": 11,
                "fill": "#dddddd"
            }
        }
    },
    "grid": {
        "line": {
            "stroke": "#dddddd",
            "strokeWidth": 0.1
        }
    },
    "legends": {
        "title": {
            "text": {
                "fontSize": 11,
                "fill": "#dddddd"
            }
        },
        "text": {
            "fontSize": 11,
            "fill": "#dddddd"
        },
        "ticks": {
            "line": {},
            "text": {
                "fontSize": 10,
                "fill": "#dddddd"
            }
        }
    },
    "annotations": {
        "text": {
            "fontSize": 16,
            "fill": "#dddddd",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "link": {
            "stroke": "#dddddd",
            "strokeWidth": 1,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "outline": {
            "stroke": "#dddddd",
            "strokeWidth": 2,
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        },
        "symbol": {
            "fill": "#dddddd",
            "outlineWidth": 2,
            "outlineColor": "#ffffff",
            "outlineOpacity": 1
        }
    },
    "tooltip": {
        "container": {
            "background": "#ffffff",
            "color": "#333333",
            "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
    }
}