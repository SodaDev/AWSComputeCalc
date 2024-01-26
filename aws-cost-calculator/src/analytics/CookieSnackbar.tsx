import CookieConsent, {getCookieConsentValue} from "react-cookie-consent";
import React, {useEffect} from "react";
import {clearGa, initGa} from "./GA";
import {Button} from "@mui/material";

export default function CookieSnackBar() {
    useEffect(() => {
        const isConsent = getCookieConsentValue();
        if (isConsent === "true") {
            initGa();
        }
    }, []);

    const bgSytle = {background: "#232f3e"}
    return (
        <CookieConsent enableDeclineButton
                       style={bgSytle}
                       buttonStyle={bgSytle}
                       declineButtonStyle={bgSytle}
                       declineButtonText={<Button variant="outlined" color="error">Decline</Button>}
                       buttonText={<Button variant="contained" color="success">Accept</Button>}
                       onAccept={() => initGa()} onDecline={() => clearGa()}>
            This website uses cookies to enhance user experience.
        </CookieConsent>
    )
}