import Box from "@mui/material/Box";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faGithub,
    faLinkedinIn,
    faMedium
} from "@fortawesome/free-brands-svg-icons";
import {Avatar, Link, Stack} from "@mui/material";
import {theme} from "../../Theme";

const links = [
    {icon: faLinkedinIn, url: "https://www.linkedin.com/in/marcinsodkiewicz"},
    {icon: faMedium, url: "https://medium.com/@sodkiewiczm"},
    {icon: faGithub, url: "https://github.com/SodaDev"}
]

export default function GetInTouch() {
    const avatarIconSize = "1x"
    const avatarStyle = {
        bgcolor: theme.palette.secondary.main
    }
    return (
        <Box display="flex" justifyContent="center" alignItems="center" minWidth="100vw">
            <Stack direction="row" spacing={2}>
                {
                    links.map(link =>
                        (<Link key={link.url} href={link.url} color="inherit" target={"_blank"}>
                            <Avatar sx={avatarStyle}>
                                <FontAwesomeIcon icon={link.icon} size={avatarIconSize}/>
                            </Avatar>
                        </Link>))
                }
            </Stack>
        </Box>
    )
}