import React from "react";
import styles from "../styles/Chess_ProgressBar.module.css";
export default function Chess_ProgressBar({ whitePerc, drawPerc, blackPerc }) {
  return (
    <>
      <div className={styles.suggestedMovesSuggestedMovesList}>
        <div
          className={styles.suggestedMovesSuggestedWhite}
          style={{ flexGrow: `${whitePerc}` }}
        >
          <span className="suggested-moves-percent-label">{`${whitePerc}%`}</span>
        </div>
        <div
          className={styles.suggestedMovesSuggestedDraw}
          style={{ flexGrow: `${drawPerc}` }}
        >
          <span className="suggested-moves-percent-label">{`${drawPerc}%`}</span>
        </div>
        <div
          className={styles.suggestedMovesSuggestedBlack}
          style={{ flexGrow: `${blackPerc}` }}
        >
          <span className="suggested-moves-percent-label">{`${blackPerc}%`}</span>
        </div>
      </div>
    </>
  );
}
