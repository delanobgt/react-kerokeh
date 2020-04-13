import React from "react";
import P5Wrapper from "react-p5-wrapper";
import sketch from "./sketch";

interface IProps {
  playMode: boolean;
}

export default class App extends React.Component<IProps> {
  render() {
    const alpha = this.props.playMode ? 0.5 : 0.8;

    return (
      <>
        <div
          style={{
            background: `rgba(0, 0, 0, ${alpha})`,
            position: "absolute",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: -4,
          }}
        ></div>
        <div
          id="lol_container"
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            zIndex: -5,
          }}
        >
          <P5Wrapper sketch={sketch} />
        </div>
      </>
    );
  }
}
