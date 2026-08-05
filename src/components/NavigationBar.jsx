import styles from "./NavigationBar.module.css";
import add_icon from "../assets/add_icon.svg";
import { useLoginContext } from "../context/LoginContext";
import { useGeneralContext } from "../context/GeneralContext";

function NavigationBar() {
  const { curUser, logout } = useLoginContext();
  const { setshowApplicationForm } = useGeneralContext();
  return (
    <>
      <div className={styles.div}>
        {/* {console.log(curUser)} */}
        <p>hi, {curUser ? curUser["username"] : "demo"}</p>
        <a onClick={() => setshowApplicationForm(true)}>
          <img src={add_icon} alt="add icon" /> new
        </a>
        <button className={styles.btnLogout} onClick={logout}>
          logout
        </button>
      </div>
    </>
  );
}

export default NavigationBar;
