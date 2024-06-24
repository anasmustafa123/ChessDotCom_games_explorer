import React from "react";
import styles from "../styles/Navbar.module.css";
export default function Navbar() {
  return (
    <div className={styles.headerContainer}>
      <a
        style={{ marginRight: "1rem" }}
        target="_blank"
        href="https://ko-fi.com/anasmostafa"
      >
        Donations
      </a>
      <a
        target="_blank"
        href="https://github.com/anasmustafa123/ChessDotCom_games_explorer"
      >
        source code
      </a>
    </div>
  );
}
