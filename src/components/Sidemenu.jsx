import styles from "./Sidemenu.module.css";
import app_icon from "../assets/event_list_24dp.svg";
import comp_icon from "../assets/corporate_fare_24dp.svg";
import source_icon from "../assets/line_start_diamond_24dp.svg";
import account_icon from "../assets/account_circle_24dp.svg";
import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";

function Sidemenu() {
  // const [current, setCurrent] = useState("");
  const { pathname } = useLocation();
  const path = pathname.split("/").pop();
  // console.log(path);
  // setCurrent(path)
  const navigate = useNavigate();
  function handleDivClick(e) {
    console.log(e.target.id);
    navigate(e.target.id);
  }

  return (
    <div className={styles.menu} onClick={handleDivClick}>
      <div
        id="applications"
        className={styles.item}
        // {path == 'application'}
        style={
          path === "applications"
            ? {
                backgroundColor: "var(--input-backround-color)",
                color: "var(--full-white)",
              }
            : {}
        }
      >
        <img src={app_icon} alt="app icon" /> applications
      </div>
      <div
        id="companies"
        className={styles.item}
        style={
          path === "companies"
            ? {
                backgroundColor: "var(--input-backround-color)",
                color: "var(--full-white)",
              }
            : {}
        }
      >
        <img src={comp_icon} alt="app icon" />
        companies
      </div>
      {/* <div
        id="sources"
        className={styles.item}
        style={
          path === "sources"
            ? {
                backgroundColor: "var(--input-backround-color)",
                color: "var(--full-white)",
              }
            : {}
        }
      >
        <img src={source_icon} alt="source icon" />
        sources
      </div> */}
      <div
        id="account"
        className={styles.item}
        style={
          path === "account"
            ? {
                backgroundColor: "var(--input-backround-color)",
                color: "var(--full-white)",
              }
            : {}
        }
      >
        <img src={account_icon} alt="account icon" />
        account
      </div>
    </div>
  );
}

export default Sidemenu;
