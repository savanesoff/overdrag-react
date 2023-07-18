import { Box, Button, Divider, Typography } from "@mui/material";
import { ComputedPosition } from "overdrag";
import { useState } from "react";
import Overdrag from "./../src";

function App() {
  const [showOverdrag, setShowOverdrag] = useState(true);

  const toggleOverdrag = () => {
    setShowOverdrag((prev) => !prev);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
          padding: "2rem",
          maxWidth: "100%",
        }}
      >
        <Typography variant="h3">overdrag-react demo </Typography>
        <Divider sx={{ width: "100%", margin: "1rem" }} />
        <img src="https://raw.githubusercontent.com/savanesoff/protosus/main/public/icons/by-protosus.svg" />
        <Divider sx={{ width: "100%", margin: "1rem" }} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <a
            href="https://github.com/savanesoff/overdrag-react"
            target="_blank"
          >
            <img src="https://badgen.net/badge/Protosus/overdrag-react?color=purple&icon=github" />
          </a>

          <a
            href="https://github.com/savanesoff/overdrag-react/actions/workflows/publish.yaml"
            target="_blank"
          >
            <img src="https://github.com/savanesoff/overdrag-react/actions/workflows/publish.yaml/badge.svg?branch=main&event=push" />
          </a>

          <a href="https://badge.fury.io/js/overdrag-react" target="_blank">
            <img src="https://badge.fury.io/js/overdrag-react.svg" />
          </a>

          <a href="https://opensource.org/licenses/MIT" target="_blank">
            <img src="https://img.shields.io/badge/license-MIT-blue.svg" />
          </a>

          <a href="https://www.linkedin.com/in/samvel-avanesov" target="_blank">
            <img src="https://badgen.net/badge/savanesoff/LI?color=blue" />
          </a>
        </Box>

        <Typography variant="body1">
          Drag and resize components with mouse or touch. Toggle show/hide to
          ensure React component is compliant with the library.
        </Typography>

        <Button
          variant="contained"
          onClick={toggleOverdrag}
          style={{
            marginTop: "1rem",
          }}
        >
          {showOverdrag ? "Hide" : "Show"} Overdrag
        </Button>
        <br />
        <div className="overdrag-container">
          {showOverdrag && <OverdragComponent />}
        </div>
      </div>
    </>
  );
}

function OverdragComponent() {
  const [over, setOver] = useState(false);
  const [drag, setDrag] = useState(false);
  const [bounds, setBounds] = useState<ComputedPosition>();
  return (
    <div className="overdrag-container">
      <Overdrag
        className="overdrag"
        onOver={() => setOver(true)}
        onOut={() => setOver(false)}
        onDragStart={() => setDrag(true)}
        onDragEnd={() => setDrag(false)}
        onClick={() => console.log("clicked")}
        onUpdate={(overdrag) => setBounds(overdrag.position)}
        minContentHeight={300}
        minContentWidth={300}
        style={{
          height: "300px",
          width: "300px",
        }}
      >
        <Box className="data">
          <Typography variant="body2">
            Over: {over ? "true" : "false"}
          </Typography>
          <Typography variant="body2">
            Drag: {drag ? "true" : "false"}
          </Typography>
          <Typography variant="body2">top: {bounds?.fullBounds.top}</Typography>
          <Typography variant="body2">
            left: {bounds?.fullBounds.left}
          </Typography>
          <Typography variant="body2">
            bottom: {bounds?.fullBounds.bottom}
          </Typography>
          <Typography variant="body2">
            right: {bounds?.fullBounds.right}
          </Typography>
          <Typography variant="body2">
            width: {bounds?.fullBounds.width}
          </Typography>
          <Typography variant="body2">
            height: {bounds?.fullBounds.height}
          </Typography>
        </Box>
      </Overdrag>
    </div>
  );
}

export default App;
