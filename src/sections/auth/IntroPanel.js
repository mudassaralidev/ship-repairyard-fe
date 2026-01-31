import { Box, Stack, Typography, Grid, Paper } from "@mui/material";
import {
  ScheduleOutlined,
  ToolOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BarChartOutlined,
} from "@ant-design/icons";

const features = [
  {
    icon: <ScheduleOutlined />,
    text: "Dock scheduling & berth allocation",
  },
  {
    icon: <ToolOutlined />,
    text: "Repair lifecycle tracking",
  },
  {
    icon: <AppstoreOutlined />,
    text: "Inventory & materials",
  },
  {
    icon: <TeamOutlined />,
    text: "Role-based access control",
  },
  {
    icon: <BarChartOutlined />,
    text: "Reports & operational logs",
  },
];

const IntroPanel = () => {
  return (
    <Stack spacing={4}>
      {/* Headline */}
      <Stack spacing={1}>
        <Typography variant="h2" fontWeight={700}>
          Ship Repair & Docking Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Plan, track, and manage shipyard operations with a single integrated
          platform built for modern dockyards.
        </Typography>
      </Stack>

      {/* Features */}
      <Grid container spacing={2}>
        {features.map((item, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  fontSize: 20,
                  color: "primary.main",
                }}
              >
                {item.icon}
              </Box>
              <Typography>{item.text}</Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>

      {/* Demo Video Card */}
      <Paper
        elevation={4}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <video
          width="100%"
          controls
          muted
          poster="https://via.placeholder.com/800x450?text=Product+Demo"
        >
          <source
            src="https://www.w3schools.com/html/mov_bbb.mp4"
            type="video/mp4"
          />
        </video>
      </Paper>
    </Stack>
  );
};

export default IntroPanel;
