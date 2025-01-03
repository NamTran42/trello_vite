import Box from "@mui/material/Box";

function BoardContent() {
  return (
    <Box
      maxWidth
      sx={{
        backgroundColor: "primary.dark",
        // height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight}`,
        display: "flex",
        alignItems: "center",
      }}
    ></Box>
  );
}

export default BoardContent;
