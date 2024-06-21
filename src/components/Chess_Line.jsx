import React from "react";
import Chess_ProgressBar from "./Chess_ProgressBar";
export default function Chess_Line({
  move,
  moveNum,
  playedCount,
  whitePerc,
  drawPerc,
  blackPerc,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        margin: "0px 1rem 0px 1rem",
        fontSize: "1.1rem",
        justifyContent: "space-between",
      }}
    >
      <div style={{minWidth: "3rem"}}>{`${moveNum}.${move}`}</div>
      <div style={{minWidth: "3rem"}}>{playedCount}</div>
      <Chess_ProgressBar
        drawPerc={drawPerc}
        blackPerc={blackPerc}
        whitePerc={whitePerc}
      />
    </div>
  );
}
