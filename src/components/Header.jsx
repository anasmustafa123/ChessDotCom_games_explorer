import React from "react";
import styles from "../styles/Header.module.css"
export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.mainContainer}>
          <img
            id="chesslogo"
            src="https://chessinsights.xyz/_nuxt/chesslogo.3b65dd8f.png"
            width="300"
          />
          <h1 className={styles.h1}> Explore your personal games on chess.com</h1>
          <p style={{textAlign: "center"}}>
            Enter your chess.com username.
          </p>
          <div className={styles.logoContainer}>
            <input
              type="text"
              list="gmsList"
              id="uname"
              aria-describedby="u-addon"
              autoCapitalize="none"
              autoCorrect="off"
              className="form-control username-input"
              placeholder="Dolols"
            />
            <span className="input-group-prepend">
              <button type="submit" className="btn btn-secondary" id="unameBtn">
                {" "}
                Get Insights{" "}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                id="uploadBtn"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Upload json file"
              >
                <svg
                  className="svg-inline--fa fa-file-arrow-up"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="file-arrow-up"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    className=""
                    fill="currentColor"
                    d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 408c0 13.3-10.7 24-24 24s-24-10.7-24-24V305.9l-31 31c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l72-72c9.4-9.4 24.6-9.4 33.9 0l72 72c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-31-31V408z"
                  ></path>
                </svg>
              </button>
            </span>
          </div>
          <div></div>
        </div>
        <datalist id="gmsList">
          <option value="nowhere2b"></option>
          <option value="mastoblood"></option>
          <option value="ajseventeen"></option>
          <option value="slimshaneyyy"></option>
          <option value="betterideas"></option>
          <option value="SvenskaRullstolen"></option>
          <option value="Dolols"></option>
          <option value="micbear1"></option>
          <option value="RedPanda1705"></option>
        </datalist>
        <dialog id="invalidUser">
          <h4>
            <strong>Invalid User </strong>
          </h4>
          <p></p>
          <button id="closeInvalidUserBtn">Close</button>
        </dialog>
      </header>
    </>
  );
}
