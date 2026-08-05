import { useState } from "react";
import styles from "./LoginComponent.module.css";
import Toast from "./Toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useLoginContext } from "../context/LoginContext";
import progress_icon from "../assets/progress_activity_24dp.svg";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { getIsLoggedIn, setIsLoggedIn } from "../utlis/utlls";

// async function login(data) {
//   const res = await fetch(
//     "https://application-tracker.fastapicloud.dev/users/token",
//     {
//       method: "POST",
//       body: data,
//       credentials: "include",
//     },
//   );
//   const value = await res.json();
//   if (res.status == 401) {
//     throw new Error(value.detail);
//   }
//   if (!res.ok) {
//     throw new Error("something went wrong");
//   }
//   console.log("login success");
//   return value;
// }

function LoginComponent() {
  const { login, isAuthenticated, isLoggedBefore } = useLoginContext();
  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("password");

  const [submitBtnDisable, setsubmitBtnDisable] = useState(false);

  const [errorValue, setErrorValue] = useState({ value: "", iserror: true });
  const [showError, setShowError] = useState(false);
  // function handleShowError() {
  //   setShowError((v) => !v);
  // }
  const navigate = useNavigate();

  function errorInput(value, iserror = true) {
    setErrorValue((e) => ({ ...e, value: value, iserror: iserror }));
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
      // console.log("timeout");
    }, 4000);
  }

  function handleEmail(value) {
    // console.log(value.target.value);
    setEmail(value.target.value);
  }

  function handlePassword(value) {
    // console.log(value.target.value);
    setPassword(value.target.value);
  }

  function handleForm(e) {
    e.preventDefault();
    const newformData = new FormData(e.target);
    // console.log(newformData.get("username"));
    // console.log(newformData.get("password"));
    // logging(newformData);
    (async () => {
      setsubmitBtnDisable(true);
      try {
        // const { access_token, token_type } = await login(newformData);
        await login(newformData);
        // console.log(access_token);
        // setaccessToken(access_token);
        errorInput("Login successful", false);
        setTimeout(() => {
          navigate("/dashboard");
          setIsLoggedIn("yes");
        }, 1000);
      } catch (error) {
        // console.log("error", error);
        errorInput(error.message);
      } finally {
        setsubmitBtnDisable(false);
      }
    })();
  }

  // async function logging(data) {
  //   setsubmitBtnDisable(true);
  //   try {
  //     const res = await fetch(
  //       "https://application-tracker.fastapicloud.dev/users/token",
  //       {
  //         method: "POST",
  //         body: data,
  //         credentials: "include",
  //       },
  //     );
  //     const val = await res.json();
  //     console.log(val);
  //     if (!res.ok) {
  //       errorInput(val.detail);
  //     }
  //   } catch {
  //     // console.log("error", error.message);
  //     // console.log("error 1", error.name);
  //     // console.log("error 2", error.stack);
  //     errorInput("something went wrong. try later.");
  //   } finally {
  //     setsubmitBtnDisable(false);
  //   }
  // }

  // ----------- uncheck
  useEffect(() => {
    if (isLoggedBefore) {
      if (isAuthenticated) {
        (() => errorInput("Already logged in. Redirecting", false))();
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      }
    }
    // setIsLoggedIn("");
  }, [isAuthenticated, navigate, isLoggedBefore]);

  // const isLoggedin = localStorage.getItem("isLoggedin");
  return (
    <div className={styles.top}>
      {isLoggedBefore && <LoadingSpinner />}
      {showError && (
        // <div className={styles.topToast}>
        <Toast
          errorValue={errorValue.value}
          toastHandle={() => setShowError(false)}
          error={errorValue.iserror}
        />
        // </div>
      )}
      <div className={styles.form}>
        <h1>Login </h1>
        <form
          className={styles.loginform}
          id="loginform"
          onSubmit={(e) => handleForm(e)}
        >
          <div className={styles.inputDiv}>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              // type="text"
              name="username"
              id="email"
              required
              value={email}
              onChange={(e) => handleEmail(e)}
              placeholder="example@gmail.com"
              // style={{
              //   borderColor: showError ? "red" : "",
              // }}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="password">
              password: <span>(minimum 8 characters)</span>
            </label>
            <input
              type="password"
              name="password"
              id="password"
              minLength={8}
              required
              value={password}
              placeholder="your password"
              onChange={(e) => handlePassword(e)}
              // style={{
              //   borderColor: showError ? "red" : "",
              // }}
            />
          </div>
          <div className={styles.btnDiv}>
            {/* <a href="" className={`${styles.btn} ${styles.btnLink}`}>
              sign up
            </a> */}
            {/* <input type="submit" name="log in" /> */}
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnSubmit}`}
              disabled={submitBtnDisable}
            >
              {submitBtnDisable ? (
                <img
                  className="progressIcon"
                  src={progress_icon}
                  alt="loading icon"
                />
              ) : (
                "log in"
              )}
            </button>
          </div>
          <div className={styles.goto}>
            <p>Don not have an account?</p>
            {/* <a href="">login</a> */}
            <NavLink to={"/signup"}>sign up</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginComponent;
