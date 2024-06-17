import React from "react";
import styles from "../styles/Input_SideBar.module.css";
export default function Input_SideBar() {
  return (
    <>
      <div className={styles.sidebar_container}>
        <h1>Personal Explorer</h1>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="chess.com Username"
        />
        <div className={styles.periodContainer}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type="radio" name="period" id="all" />
            <label className={styles.label_horizontal} htmlFor="all">
              All Games
            </label>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input type="radio" name="period" id="specific" />
            <label className={styles.label_horizontal} htmlFor="specific">
              Select Period
            </label>
          </div>
        </div>

        <div className={styles.dateContainer}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label className={styles.label_vertical} style={{fontSize: "19px"}} htmlFor="fromDate">
              From
            </label>
            <input type="month" name="fromDate" id="fromDate" />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <label className={styles.label_vertical} style={{fontSize: "19px"}} htmlFor="toDate">
              To
            </label>
            <input type="month" name="toDate" id="toDate" />
          </div>
        </div>

        <button className={styles.submitBtn} onClick={async () => {}}>
          Load
        </button>
      </div>
    </>
  );
}
