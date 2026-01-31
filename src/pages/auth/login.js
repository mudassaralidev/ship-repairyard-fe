import { useEffect, useRef, useState } from "react";
import { Grid, Box, Button, Stack } from "@mui/material";
import useAuth from "hooks/useAuth";
import AuthLogin from "sections/auth/auth-forms/AuthLogin";
import IntroPanel from "sections/auth/IntroPanel";
import ContactSupportForm from "sections/auth/ContactSupportForm";
import AuthCard from "sections/auth/AuthCard";

const Login = () => {
  const { isLoggedIn } = useAuth();
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Refs for scrolling
  const loginRef = useRef(null);
  const demoRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    failedAttempts >= 2 && scrollToSection(contactRef);
  }, [failedAttempts]);

  return (
    <Box>
      {/* TOP RIGHT BUTTONS */}
      <Box position="fixed" top={16} right={16} zIndex={1000}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={() => scrollToSection(demoRef)}>
            Demo
          </Button>
          <Button
            variant="outlined"
            onClick={() => scrollToSection(contactRef)}
          >
            Contact Us
          </Button>
        </Stack>
      </Box>

      <Grid container direction="column">
        {/* LOGIN SECTION */}
        <Grid
          item
          ref={loginRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ px: 2 }}
        >
          <AuthCard>
            <AuthLogin
              isDemo={isLoggedIn}
              onLoginFailed={() => setFailedAttempts((p) => p + 1)}
              onLoginSuccess={() => setFailedAttempts(0)}
            />
          </AuthCard>
        </Grid>

        {/* DEMO / INTRO PANEL SECTION */}
        <Grid
          item
          ref={demoRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ px: 2, bgcolor: "background.default" }}
        >
          <Box maxWidth={560} width="100%">
            <IntroPanel />
          </Box>
        </Grid>

        {/* CONTACT SUPPORT SECTION */}
        <Grid
          item
          ref={contactRef}
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
          sx={{ px: 2 }}
        >
          <Box maxWidth={560} width="100%">
            <ContactSupportForm />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
