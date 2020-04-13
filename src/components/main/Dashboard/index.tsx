import React from "react";
import { Typography, Button } from "@material-ui/core";
import {
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon,
  Textsms as TextsmsIcon,
} from "@material-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { IFavorite } from "src/store/favorite";
import ReactJkMusicPlayer from "react-jinke-music-player";
import Backdrop from "./Backdrop";
import "src/components/main/Auth/style.css";
import "react-h5-audio-player/lib/styles.css";
import "react-jinke-music-player/assets/index.css";
import "./style.css";
import LyricsPanel from "./LyricsPanel";
import Fade from "react-reveal/Fade";

function Dashboard() {
  const playingFavorite = useSelector<RootState, IFavorite>(
    (state) => state.favorie.playingFavorite
  );

  const accompanimentInstance = React.useRef<any>(null);
  const vocalsInstance = React.useRef<any>(null);
  const [vocalMuted, setVocalMuted] = React.useState<boolean>(true);
  const [lyricsShown, setLyricsShown] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (!vocalsInstance.current) return;
    if (vocalMuted) vocalsInstance.current.volume = 0;
    else vocalsInstance.current.volume = accompanimentInstance.current.volume;
  }, [vocalMuted, vocalsInstance.current]);

  let prefixUrl = "";
  if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
    prefixUrl = "http://localhost:8000/";
  }

  return (
    <>
      <Backdrop playMode={Boolean(playingFavorite)} />

      <div
        style={{
          // backgroundColor: "#172727",
          height: "100vh",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {!playingFavorite ? (
          <Fade bottom>
            <Typography variant="h3" align="center" style={{ color: "white" }}>
              Upload a Song <br />
              <span style={{ fontSize: "1.5rem" }}>or</span>
              <br /> Choose from Library
            </Typography>
          </Fade>
        ) : (
          <div>
            {/* <Typography variant="h6" align="center" style={{ color: "white" }}>
              Now Playing
            </Typography>
            <br />
            <br /> */}
            <Fade bottom>
              <>
                <Typography
                  variant="h3"
                  className="kerokeh-title"
                  style={{ letterSpacing: "0.5rem" }}
                >
                  <strong>{playingFavorite.song.title}</strong>
                </Typography>
                <br />
                <Typography
                  variant="h5"
                  style={{ color: "white" }}
                  align="center"
                >
                  <strong>{playingFavorite.song.artist}</strong>
                </Typography>
                <Typography
                  variant="subtitle1"
                  style={{
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  align="center"
                >
                  {playingFavorite.song.album}{" "}
                  <strong style={{ fontSize: "2.5rem", color: "#FF1493" }}>
                    &nbsp;&nbsp;/&nbsp;&nbsp;
                  </strong>{" "}
                  {playingFavorite.song.genre}
                </Typography>
              </>
            </Fade>
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
                  musicSrc: `${prefixUrl}${playingFavorite.song.accompaniment_path}`,
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
              onAudioVolumeChange={(volume: number) => {
                console.log({ volume });
                if (!vocalMuted) vocalsInstance.current.volume = volume;
              }}
              onAudioPlay={(audioInfo: any) => {
                vocalsInstance.current.play();
                if (vocalMuted) vocalsInstance.current.volume = 0;
              }}
              onAudioPause={(audioInfo: any) => {
                vocalsInstance.current.pause();
                if (vocalMuted) vocalsInstance.current.volume = 0;
              }}
            />

            <audio
              ref={(instance) => (vocalsInstance.current = instance)}
              src={`${prefixUrl}${playingFavorite.song.vocals_path}`}
              autoPlay
            >
              Your browser does not support the
              <code>audio</code> element.
            </audio>

            <div
              style={{
                position: "fixed",
                bottom: 100,
                right: 15,
                width: "100vw",
                textAlign: "right",
              }}
            >
              <Button
                color={!lyricsShown ? "default" : "primary"}
                variant="contained"
                onClick={() => setLyricsShown(!lyricsShown)}
              >
                <TextsmsIcon />
                &nbsp; Lyrics
              </Button>
              &nbsp; &nbsp;
              <Button
                color={vocalMuted ? "default" : "primary"}
                variant="contained"
                onClick={() => setVocalMuted(!vocalMuted)}
              >
                {vocalMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}&nbsp; Vocal
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

      {Boolean(playingFavorite) && (
        <LyricsPanel
          show={lyricsShown}
          lyrics={playingFavorite.song.lyrics}
          dismiss={() => setLyricsShown(false)}
        />
      )}
    </>
  );
}

export default Dashboard;
