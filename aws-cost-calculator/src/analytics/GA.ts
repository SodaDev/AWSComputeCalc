import ReactGA from "react-ga";
import {Cookies} from "react-cookie-consent";

export function initGa() {
    ReactGA.initialize('UA-233771537-1');
    ReactGA.pageview(window.location.pathname + window.location.search);
    ReactGA.set({anonymizeIp: true})
}

export function clearGa() {
    Cookies.remove("_ga");
    Cookies.remove("_gat");
    Cookies.remove("_gid");
}