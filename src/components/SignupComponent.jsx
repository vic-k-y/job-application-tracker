import { useState } from "react";
import styles from "./LoginComponent.module.css";
import Toast from "./Toast";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useLoginContext } from "../context/LoginContext";
import progress_icon from "../assets/progress_activity_24dp.svg";
// import { getIsLoggedIn } from "../utlis/utlls";
import LoadingSpinner from "./LoadingSpinner";

function SignupComponent() {
  const { isAuthenticated, isLoggedBefore, setisLoggedBefore } =
    useLoginContext();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("example");
  const [email, setEmail] = useState("example@gmail.com");
  const [password, setPassword] = useState("password");

  const [submitBtnDisable, setsubmitBtnDisable] = useState(false);

  const [errorValue, setErrorValue] = useState({ value: "", iserror: true });
  const [showError, setShowError] = useState(false);

  function errorInput(value, iserror = true) {
    setErrorValue((e) => ({ ...e, value: value, iserror: iserror }));
    // setErrorValue({ value: value, iserror: iserror });
    setShowError(true);

    setTimeout(() => {
      setShowError(false);
      // console.log("timeout");
    }, 5000);
  }

  function handleUserName(value) {
    // console.log(value.target.value);
    setUserName(value.target.value);
  }
  function handleEmail(value) {
    // console.log(value.target.value);
    setEmail(value.target.value);
  }

  function handlePassword(value) {
    // console.log(value.target.value);
    setPassword(value.target.value);
  }

  async function handleForm(e) {
    e.preventDefault();
    setsubmitBtnDisable(true);
    // console.log(userName, email, password);
    const obj = {
      username: userName,
      email: email,
      password: password,
    };
    try {
      const res = await fetch(
        "https://application-tracker.fastapicloud.dev/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(obj),
          credentials: "include",
        },
      );
      const val = await res.json();
      if (res.ok) {
        // console.log("created");
        errorInput("user created. redirecting to login page", false);
        // localStorage.setItem("isLoggedin", "yes");
        // setisLoggedBefore(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      if (res.status == 400) {
        throw new Error(val.detail);
      }
      if (!res.ok) {
        // console.log(val.detail[0]);
        throw new Error("something went wrong. try later");
      }
    } catch (error) {
      // console.log("something went wrong");
      errorInput(error.message);
    } finally {
      setsubmitBtnDisable(false);
    }
  }

  // useEffect(() => {
  //   if (isAuthenticated) navigate("/dashboard");
  // }, [isAuthenticated, navigate]);
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
        // <div className={styles.topToastDiv}>
        <Toast
          errorValue={errorValue.value}
          toastHandle={() => setShowError(false)}
          error={errorValue.iserror}
          // error={errorValue.iserror}
        />
        // </div>
      )}
      <div className={styles.form}>
        <h1>sign up </h1>
        <form className={styles.loginform} onSubmit={(e) => handleForm(e)}>
          <div className={styles.inputDiv}>
            <label htmlFor="username">Name: </label>
            <input
              type="text"
              // type="text"
              name="username"
              id="username"
              required
              value={userName}
              onChange={(e) => handleUserName(e)}
              placeholder="full name"
              // style={{
              //   borderColor: showError ? "red" : "",
              // }}
            />
          </div>
          <div className={styles.inputDiv}>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              // type="text"
              name="email"
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
              login
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
                "sign up"
              )}
            </button>
          </div>
          <div className={styles.goto}>
            <p>Have an account?</p>
            <NavLink to={"/"}>login</NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignupComponent;
