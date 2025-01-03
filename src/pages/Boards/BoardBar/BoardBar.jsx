import Box from "@mui/material/Box";

function BoardBar() {
  return (
    <Box
      maxWidth
      sx={{
        // backgroundColor: "primary.main",
        backgroundColor: "white",
        height: (theme) => theme.trello.boardBarHeight,
        display: "flex",
        alignItems: "center",
      }}
    ></Box>
  );
}

export default BoardBar;
