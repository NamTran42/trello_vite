import Box from "@mui/material/Box";

function BoardBar() {
  return (
    <Box
      maxWidth
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode !== "dark" ? "#34495e" : "#1976d2",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    ></Box>
  );
}

export default BoardBar;
