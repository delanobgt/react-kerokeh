import React from "react";
import { Grid, Typography, Button } from "@material-ui/core";
import VideoPlayer from "react-background-video-player";
import LoginDialog from "../dialogs/LoginDialog";
import BgVideo from "src/media/bg.mp4";
import "../style.css";
import SignUpDialog from "../dialogs/SignUpDialog";
import Fade from "react-reveal/Fade";

const Login = () => {
  const [windowWidth, setWindowWidth] = React.useState<number>(
    window.innerWidth
  );
  const [windowHeight, setWindowHeight] = React.useState<number>(
    window.innerHeight
  );
  const [loginDialogOpen, setLoginDialogOpen] = React.useState<boolean>(false);
  const [signUpDialogOpen, setSignUpDialogOpen] = React.useState<boolean>(
    false
  );
  const player = React.useRef();

  const handleResize = React.useCallback(() => {
    setWindowWidth(window.innerWidth);
    setWindowHeight(window.innerHeight);
  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  return (
    <>
      <VideoPlayer
        ref={(p: any) => (player.current = p)}
        containerWidth={windowWidth}
        containerHeight={windowHeight}
        src={[
          {
            src: BgVideo,
            type: "video/mp4",
          },
        ]}
        poster={
          "https://cdn2.tstatic.net/kaltim/foto/bank/images/comeback-mv-twice-fancy-dirilis-lirik-lagu-dan-terjemahannya-dalam-bahasa-indonesia.jpg"
        }
        autoPlay
        muted
        loop
        style={{
          zIndex: -5,
        }}
      />
      <Grid
        container
        justify="center"
        alignItems="center"
        style={{ width: "100vw", height: "100vh", zIndex: 2 }}
      >
        <Grid item xs={11} sm={11} md={11} lg={11}>
          <Fade bottom>
            {" "}
            <>
              <Typography
                variant="h1"
                className="kerokeh-title"
                style={{ letterSpacing: "1.5rem" }}
              >
                <strong>KEROKEH</strong>
              </Typography>

              <br />

              <Typography
                variant="h6"
                align="center"
                style={{ color: "white" }}
              >
                Sing off your passion!
              </Typography>

              <br />

              <div style={{ textAlign: "center" }}>
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ borderWidth: "2px" }}
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Log In
                </Button>
                &nbsp; &nbsp; &nbsp;
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => setSignUpDialogOpen(true)}
                >
                  Sign Up
                </Button>
              </div>
            </>
          </Fade>
        </Grid>
      </Grid>

      {Boolean(loginDialogOpen) && (
        <LoginDialog
          open={loginDialogOpen}
          dismiss={() => setLoginDialogOpen(false)}
        />
      )}
      {Boolean(signUpDialogOpen) && (
        <SignUpDialog
          open={signUpDialogOpen}
          dismiss={() => setSignUpDialogOpen(false)}
        />
      )}
    </>
  );
};

export default Login;
