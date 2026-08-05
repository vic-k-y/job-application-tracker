import styles from "./LoadingSpinner.module.css";
import loading_icon from "../assets/progress_activity_24dp.svg";

function LoadingSpinner() {
  return (
    <div className={styles.topDiv}>
      <img className="progressIcon" src={loading_icon} alt="loadin icon" />

      <p>loading</p>
    </div>
  );
}

export default LoadingSpinner;
