import * as React from "react";
import ModeSelect from "~/components/ModeSelect";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import AppsIcon from "@mui/icons-material/Apps";
import { ReactComponent as trelloLogo } from "~/assets/trello.svg";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import Workspaces from "./Menus/Workspaces";
import Recent from "./Menus/Recent";
import Templates from "./Menus/Templates";
import Starred from "./Menus/Starred";
import Profile from "./Menus/Profile";
import TextField from "@mui/material/TextField";
import Badge from "@mui/material/Badge";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import Tooltip from "@mui/material/Tooltip";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

function AppBar() {
  const [invisible, setInvisible] = React.useState(false);

  const handleBadgeVisibility = () => {
    setInvisible(!invisible);
  };
  return (
    <Box
      // maxWidth
      sx={{
        height: (theme) => theme.trello.appBarHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white", //  example
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <AppsIcon sx={{ color: "primary.main" }} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SvgIcon
            component={trelloLogo}
            inheritViewBox
            sx={{ color: "primary.main" }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Trello
          </Typography>
        </Box>
        <Workspaces />
        <Recent />
        <Starred />
        <Templates />
        <Button variant="outlined">Create</Button>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search ..."
          type="search"
          size="small"
        />
        <ModeSelect />
        <Tooltip title="Notification">
          <Badge
            color="secondary"
            variant="dot"
            invisible={invisible}
            sx={{ cursor: "pointer" }}
          >
            <NotificationsNoneIcon />
          </Badge>
        </Tooltip>

        <Tooltip title="Help">
          <Badge
            color="secondary"
            variant="dot"
            invisible={invisible}
            sx={{ cursor: "pointer" }}
          >
            <HelpOutlineIcon />
          </Badge>
        </Tooltip>
        <Profile />
      </Box>
    </Box>
  );
}

export default AppBar;
