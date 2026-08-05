import { Outlet, useNavigate } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";
import { useGeneralContext } from "../context/GeneralContext";

import { useEffect } from "react";
import styles from "./Dashboard.module.css";
import Sidemenu from "../components/Sidemenu";
import NavigationBar from "../components/NavigationBar";
import { useState } from "react";
import ApplicationForm from "../components/ApplicationForm";
import LoadingSpinner from "../components/LoadingSpinner";
import Toast from "../components/Toast";

// async function logoutCall() {
//   const res = await fetch(
//     "https://application-tracker.fastapicloud.dev/users/logout",
//     { method: "POST" },
//   );
//   const value = await res.json();
//   console.log(value);
//   console.log(res.status);
// }

function Dashboard() {
  const navigate = useNavigate();
  const { curUser, isLoggedBefore } = useLoginContext();
  // const { showToast, errorList } = useGeneralContext();
  const { error, setError, showApplicationForm, setshowApplicationForm } =
    useGeneralContext();

  // const [showApplicationForm, setshowApplicationForm] = useState(false);

  // ----------- uncheck
  useEffect(() => {
    if (isLoggedBefore) return;
    if (!curUser) navigate("/");
  }, [curUser, navigate, isLoggedBefore]);

  // console.log(showToast);
  // function addingError(data) {
  //   setError(data);
  //   setTimeout(() => {
  //     setError({});
  //   }, 2000);
  // }
  // addingError({ value: "error" });
  // setError({ value: "error" });

  return (
    <div className={styles.div}>
      {error && (
        <Toast
          errorValue={error["value"]}
          error={error["iserror"]}
          toastHandle={() => setError()}
        />
      )}
      {/* {<Toast errorValue={"error"} />} */}
      {/* {isLoggedBefore && !curUser && <LoadingSpinner />} */}
      {showApplicationForm && <ApplicationForm />}
      <NavigationBar />
      <div className={styles.content}>
        <Sidemenu />
        <div className={styles.listdiv}>
          <Outlet />
        </div>
      </div>
      {/* {console.log(curUser)}
      <button
        onClick={async () => {
          await logout();
        }}
      >
        logout
      </button> */}
    </div>
  );
}

export default Dashboard;
