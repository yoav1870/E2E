import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import Header from "../component/Header";

const Information = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const token = localStorage.getItem("token");
        const userResponse = await axios.get(
          "https://e2e-y8hj.onrender.com/api/users/home",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const user = userResponse.data;
        let searchQueries = [];

        if (user.role === "service_provider") {
          searchQueries = [user.profession];
        } else {
          const reportsResponse = await axios.get(
            "https://e2e-y8hj.onrender.com/api/reports/home",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const reports = reportsResponse.data;
          searchQueries = reports
            .slice(0, 5)
            .map((report) => `${report.profession} ${report.description}`);
        }

        const youtubeApiKey = "AIzaSyAkUl6glORD9H5Futo0QktijzL2j2mLmbE";
        const videoPromises = searchQueries.map(async (query) => {
          const youtubeResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${youtubeApiKey}&maxResults=1`
          );
          return youtubeResponse.data.items[0];
        });

        const videoResults = await Promise.all(videoPromises);
        setVideos(videoResults);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          fontFamily="Georgia, serif"
          sx={{ textAlign: "center" }}
        >
          Recommended Videos
        </Typography>

        {videos.length === 0 ? (
          <Typography>No videos found.</Typography>
        ) : (
          <List>
            {videos.map(
              (video) =>
                video && ( // Add a check to ensure the video object exists
                  <ListItem key={video.id.videoId}>
                    <Box sx={{ width: "100%" }}>
                      <iframe
                        width="100%"
                        height="400"
                        src={`https://www.youtube.com/embed/${video.id.videoId}`}
                        title={video.snippet.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <ListItemText primary={video.snippet.title} />
                    </Box>
                  </ListItem>
                )
            )}
          </List>
        )}
      </Container>
    </>
  );
};

export default Information;
