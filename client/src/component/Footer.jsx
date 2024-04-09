import { Box, Container, Typography, Link } from "@mui/material";
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#1D2830",
        color: "white",
        py: 2,
        mt: "auto",
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Typography
          variant="body1"
          component="p"
          sx={{
            fontFamily: "serif",
          }}
        >
          E2E
        </Typography>
        <Link
          href="https://github.com/yoav1870/E2E"
          target="_blank"
          style={{ color: "white" }}
        >
          <FaGithub size={30} style={{ marginBottom: "10px" }} />
        </Link>
      </Container>

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          gap: 2,
        }}
      >
        <Typography variant="body1" component="p" sx={{ fontFamily: "serif" }}>
          <Link
            href="https://github.com/yoav1870"
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
          >
            Yoav zucker
          </Link>{" "}
          |
          <Link
            href="https://github.com/noy2611"
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
          >
            {" "}
            Noy Raichman
          </Link>{" "}
          |
          <Link
            href="https://github.com/Mawasi1"
            target="_blank"
            style={{ color: "white", textDecoration: "none" }}
          >
            {" "}
            Nour Muassi
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
