import ReactGA from "react-ga4";
import {Cookies} from "react-cookie-consent";

export function initGa() {
    ReactGA.initialize('G-52ZWTR68FX');
    ReactGA.set({anonymizeIp: true})
}

export function clearGa() {
    Cookies.remove("_ga");
    Cookies.remove("_ga_52ZWTR68FX");
    Cookies.remove("_gat");
    Cookies.remove("_gid");
}