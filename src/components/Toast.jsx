import styles from "./Toast.module.css";
// import closeicon from "../assets/icons8-close-window-50.png";
import closeicon from "../assets/close_24dp.svg";

function Toast({ errorValue, toastHandle, error = false }) {
  return (
    <div
      className={styles.div}
      style={{
        border: `1px solid ${error ? "rgb(245, 73, 0)" : "rgb(0, 201, 80)"}`,
      }}
    >
      <p>{errorValue}</p>
      <button className={styles.toastBtn} onClick={toastHandle}>
        <img
          className={styles.toastBtnIcon}
          src={closeicon}
          alt="toast close button"
        />
      </button>
    </div>
  );
}

export default Toast;
