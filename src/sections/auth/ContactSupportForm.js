import {
  Box,
  Stack,
  Typography,
  TextField,
  Button,
  Paper,
} from "@mui/material";

const ContactSupportForm = () => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 560,
        backgroundColor: "#fff",
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack spacing={0.5} textAlign="center">
          <Typography variant="h4">Contact Us</Typography>
          <Typography variant="body2" color="text.secondary">
            We will get back to you ASAP
          </Typography>
        </Stack>

        {/* Full Name */}
        <TextField fullWidth label="Full Name" placeholder="Enter your name" />

        {/* Email */}
        <TextField
          fullWidth
          type="email"
          label="Email"
          placeholder="Enter your email"
        />

        {/* Phone */}
        <TextField
          fullWidth
          label="Phone Number"
          placeholder="Enter phone number"
        />

        {/* Shipyard Name */}
        <TextField
          fullWidth
          label="Shipyard Name"
          placeholder="Enter shipyard name"
        />

        {/* Comment */}
        <TextField
          fullWidth
          label="Comment"
          placeholder="Describe the issue you’re facing"
          multiline
          rows={3}
        />

        {/* Submit */}
        <Button
          fullWidth
          size="large"
          variant="contained"
          sx={{
            borderRadius: 2,
            py: 1.2,
          }}
        >
          Send
        </Button>

        {/* Footer */}
        <Typography variant="caption" color="text.secondary" textAlign="center">
          You may also call us at <strong>333-33-33</strong>
        </Typography>
      </Stack>
    </Paper>
  );
};

export default ContactSupportForm;
