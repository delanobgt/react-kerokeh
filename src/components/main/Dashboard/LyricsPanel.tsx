import React from "react";
import styled from "styled-components";
import { Typography, IconButton } from "@material-ui/core";
import { Minimize as MinimizeIcon } from "@material-ui/icons";
import Fade from "react-reveal/Fade";

interface IProps {
  show: boolean;
  lyrics: string;
  dismiss: () => void;
}

const Panel = styled.div`
  position: fixed;
  width: 22vw;
  height: 50vh;
  top: 20vh;
  right: 15px;
  background: rgba(51, 51, 51, 0.7);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

function LyricsPanel(props: IProps) {
  let { show, lyrics, dismiss } = props;

  lyrics =
    lyrics ||
    `
        adwqwujioduiwq udhquiwbd
         qwuibiud qw qwdlorem Lorem ipsum dolor
        sit amet,
         consectetur adipisicing elit. At repellendus totam dolores
        possimus
         eius excepturi sint, voluptas iusto recusandae non voluptatibus
        qui facilis enim, consectetur velit laboriosam. Iusto, sed similique.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae
        quas fugit cumque totam obcaecati fuga consectetur facilis assumenda at.
        Consequatur nostrum eum repellat praesentium sapiente inventore
        laboriosam iure repellendus asperiores! Lorem ipsum dolor, sit amet
        consectetur adipisicing elit. Eos, debitis nisi ad et laboriosam
        voluptatem sit iste, ducimus nobis repellendus illum asperiores adipisci
        odit, quae reiciendis inventore? Laudantium, provident consequuntur?
      `;

  if (show) return null;
  return (
    <Fade bottom>
      <Panel>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            style={{ color: "white", paddingLeft: "0.8rem" }}
          >
            Lyrics Snippet
          </Typography>
          <IconButton onClick={() => dismiss()} style={{ color: "white" }}>
            <MinimizeIcon />
          </IconButton>
        </div>
        <hr style={{ margin: 0, padding: 0, borderColor: "#FF1493" }} />
        <div
          style={{
            flexGrow: 1,
            padding: "0.2rem 0.8rem",
            overflowY: "scroll",
            color: "white",
            fontSize: "0.8rem",
            lineHeight: "1.5rem",
          }}
        >
          {lyrics.split(/\n+/).map((line, index) => {
            return <div key={index}>{line.trim()}</div>;
          })}
        </div>
      </Panel>
    </Fade>
  );
}

export default LyricsPanel;
