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
        justifyContent: "space-between",
        gap: 2,
        paddingX: 2,
        overflowX: "auto",
      }}
      // bai 27
    ></Box>
  );
}

export default BoardBar;
