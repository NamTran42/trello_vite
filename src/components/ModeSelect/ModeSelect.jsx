import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useColorScheme } from "@mui/material/styles";
import LightModeIcon from "@mui/icons-material/LightMode";
import NightlightIcon from "@mui/icons-material/Nightlight";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import Box from "@mui/material/Box";
import { Palette } from "@mui/icons-material";
import { colors } from "@mui/material";

function ModeSelect() {
  const { mode, setMode } = useColorScheme();
  const handleChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);
  };

  return (
    <FormControl size="small" xs={{ minWidth: "120px" }}>
      <InputLabel id="label-select-dark-light-mode">Mode</InputLabel>
      <Select
        labelId="label-select-dark-light-mode"
        id="select-dark-light-mode"
        value={mode}
        label="Mode"
        onChange={handleChange}
      >
        <MenuItem value={"light"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "white"
            }}
          >
            <LightModeIcon fontSize="small" />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>Light</Box>
          </Box>
        </MenuItem>
        <MenuItem value={"dark"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <NightlightIcon fontSize="small" />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>Dark</Box>
          </Box>
        </MenuItem>
        <MenuItem value={"system"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SettingsBrightnessIcon fontSize="small" />
            System
          </Box>
        </MenuItem>
      </Select>
    </FormControl>
  );
}

export default ModeSelect;