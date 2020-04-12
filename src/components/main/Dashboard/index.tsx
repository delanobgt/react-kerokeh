import React from "react";
import { Typography, Button } from "@material-ui/core";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { IFavorite } from "src/store/favorite";
import "src/components/main/Auth/style.css";
import "react-h5-audio-player/lib/styles.css";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";

function Dashboard() {
  const playingFavorite = useSelector<RootState, IFavorite>(
    (state) => state.favorie.playingFavorite
  );

  const accompanimentInstance = React.useRef<any>(null);
  const vocalsInstance = React.useRef<any>(null);
  const [vocalMuted, setVocalMuted] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!vocalsInstance.current) return;
    if (vocalMuted) vocalsInstance.current.volume = 0;
    else vocalsInstance.current.volume = 1;
  }, [vocalMuted]);

  return (
    <div
      style={{
        backgroundColor: "#172727",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!playingFavorite ? (
        <Typography variant="h3" align="center" style={{ color: "white" }}>
          Upload a Song <br />
          <span style={{ fontSize: "1.5rem" }}>or</span>
          <br /> Choose from Library
        </Typography>
      ) : (
        <div>
          <Typography variant="h6" align="center" style={{ color: "white" }}>
            Now Playing
          </Typography>
          <br />
          <Typography
            variant="h3"
            className="kerokeh-title"
            style={{ letterSpacing: "0.5rem" }}
          >
            <strong>{playingFavorite.song.title}</strong>
          </Typography>
          {/* <div style={{ position: "fixed", bottom: 0, left: 0, width: "100%" }}>
            <AudioPlayer
              showSkipControls={false}
              showJumpControls={false}
              showDownloadProgress={false}
              showFilledProgress={false}
              autoPlay
              src={accompaniment}
              onPlay={(e: any) => console.log("onPlay")}
              // other props here
            />
          </div> */}

          <ReactJkMusicPlayer
            getAudioInstance={(instance) =>
              (accompanimentInstance.current = instance)
            }
            audioLists={[
              {
                name: playingFavorite.song.title,
                musicSrc: `http://localhost:8000/${playingFavorite.song.vocals_path}`,
              },
            ]}
            autoPlay
            mode="full"
            showMiniModeCover={false}
            showMiniProcessBar={false}
            // showProgressLoadBar={false}
            showReload={false}
            showDownload={false}
            showPlayMode={false}
            showThemeSwitch={false}
            showLyric={false}
            showDestroy={false}
            onAudioSeeked={(audioInfo: any) => {
              console.log(audioInfo);
              vocalsInstance.current.currentTime = audioInfo.currentTime;
              accompanimentInstance.current.currentTime = audioInfo.currentTime;
            }}
            onAudioPlay={(audioInfo: any) => {
              vocalsInstance.current.play();
            }}
            onAudioPause={(audioInfo: any) => {
              vocalsInstance.current.pause();
            }}
          />

          <audio
            ref={(instance) => (vocalsInstance.current = instance)}
            src={`http://localhost:8000/${playingFavorite.song.vocals_path}`}
            autoPlay
          >
            Your browser does not support the
            <code>audio</code> element.
          </audio>

          <div
            style={{
              position: "fixed",
              bottom: 100,
              right: 20,
              width: "100vw",
              textAlign: "right",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => setVocalMuted(!vocalMuted)}
            >
              {vocalMuted ? "Unmute Vocal" : "Mute Vocal"}
            </Button>
          </div>
        </div>
      )}
      {/* <Grid container justify="center">
        <Grid item xs={11} sm={11} md={11} lg={10}>
          <div style={{ textAlign: "center" }}>
            <CircularProgress size={24} />
          </div>
        </Grid>
      </Grid> */}
    </div>
  );
}

export default Dashboard;
