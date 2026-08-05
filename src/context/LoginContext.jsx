import { useState } from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { createContext } from "react";
import { useContext } from "react";

import { getIsLoggedIn, setIsLoggedIn } from "../utlis/utlls";
import { act } from "react";

const logincontext = createContext();
// const val = "";

const initialState = {
  isAuthenticated: false,
  curUser: null,
  accessToken: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        isAuthenticated: true,
        curUser: action.curUser,
        accessToken: action.accessToken,
      };
    case "logout":
      return { ...state, curUser: null, isAuthenticated: false };
    case "refresh":
      return {
        ...state,
        accessToken: action.accessToken,
      };
  }
}

async function getCurrentUser(token) {
  // console.log("in get cur user", token);
  const res = await fetch(
    "https://application-tracker.fastapicloud.dev/users/me",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    },
  );
  const val = await res.json();
  if (!res.ok) return null;
  return val;
}

async function firstcall() {
  const res = await fetch("https://application-tracker.fastapicloud.dev/", {
    method: "GET",
  });
  // const val = await res.json()
  if (!res.ok) return null;
  // console.log("firstcall");
}

function LoginContextProvider({ children }) {
  // const [accessToken, setaccessToken] = useState("");
  // const [currentUser, setcurrentUser] = useState();
  // const [currentUser, setcurrentUser] = useState({
  //   username: "rocky",
  //   email: "example@gmail.com",
  //   image_path: null,
  //   id: 1,
  // });
  const isLoggedin = localStorage.getItem("isLoggedin");
  const [isLoggedBefore, setisLoggedBefore] = useState(Boolean(isLoggedin));

  const [{ isAuthenticated, curUser, accessToken }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  // -------------- used beofre /|\ ------------------

  async function login(data) {
    const res = await fetch(
      "https://application-tracker.fastapicloud.dev/users/token",
      {
        method: "POST",
        body: data,
        credentials: "include",
      },
    );
    const value = await res.json();
    if (res.status == 401) {
      throw new Error(value.detail);
    }
    if (!res.ok) {
      throw new Error("something went wrong");
    }
    console.log("login success");
    // return value;
    // console.log("in login", value.access_token);
    const user = await getCurrentUser(value.access_token);
    // console.log(typeof user);
    dispatch({
      type: "login",
      isAuthenticated: true,
      curUser: user,
      accessToken: value.access_token,
    });
  }

  async function logout() {
    const res = await fetch(
      "https://application-tracker.fastapicloud.dev/users/logout",
      { method: "POST", credentials: "include" },
    );
    const value = await res.json();
    console.log(value);
    // console.log(res.status);
    // setaccessToken("");
    // setcurrentUser();
    dispatch({ type: "logout" });
    // console.log(curUser);
    // setIsLoggedIn("");
    localStorage.removeItem("isLoggedin");
    setisLoggedBefore(false);
    if (!res.ok) return null;
  }

  async function fetchRequestWrapper(
    url,
    method,
    headers = { Accept: "application/json" },
    bodyData = "",
    isRetry = true,
  ) {
    const res =
      method !== "GET"
        ? await fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(bodyData),
          })
        : await fetch(url, {
            method: method,
            headers: headers,
          });

    if (res.status === 401 && isRetry) {
      console.log("access token failed - from login context");

      try {
        const token = await refreshTokenFunction();
        const head = { ...headers, Authorization: `Bearer ${token}` };
        return fetchRequestWrapper(url, method, head, bodyData, false);
      } catch (err) {
        logout();
        throw err;
      }
    }
    if (res.status === 500 && isRetry) {
      const head = { ...headers, Authorization: `Bearer ${accessToken}` };
      return fetchRequestWrapper(url, method, head, bodyData, false);
    }
    if (res.status === 401 && !isRetry) logout();
    return res;
  }

  async function refreshTokenFunction() {
    const res = await fetch(
      "https://application-tracker.fastapicloud.dev/users/me/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );
    const val = await res.json();
    if (res.ok) {
      dispatch({ type: "refresh", accessToken: val.access_token });
      return val.access_token;
    }
    if (!res.ok) throw new Error("refresh failed.");
  }

  async function addNewCompanyWithRefresh(body) {
    const url = "https://application-tracker.fastapicloud.dev/company";

    const method = "POST";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await fetchRequestWrapper(url, method, headers, body);

    const val = await res.json();
    // console.log("add new comp in login context", val);
    if (res.ok) return val;
    if (res.status === 400) throw new Error(val["detail"]);
    if (!res.ok) throw new Error("Error adding company");
  }

  // ?--------------- /|\ -----------------

  // ----------- uncheck

  // ------------ used belore \|/ ----------------
  useEffect(() => {
    // const isLoggedin = localStorage.getItem("isLoggedin");
    if (!isLoggedBefore) return;
    (async () => {
      try {
        await firstcall();
        const token = await refreshTokenFunction();
        if (token) {
          const user = await getCurrentUser(token);
          // console.log(typeof user);
          dispatch({
            type: "login",
            isAuthenticated: true,
            curUser: user,
            accessToken: token,
          });
        }
      } catch {
        // localStorage.setItem("isLoggedin", "");
        localStorage.removeItem("isLoggedin");
        setisLoggedBefore(false);
        logout();
      }
    })();
  }, [isLoggedBefore]);
  // useEffect(() => {
  //   // const isLoggedin = localStorage.getItem("isLoggedin");
  //   if (!isLoggedBefore) return;
  //   (async () => {
  //     await firstcall();
  //     const token = await refreshTokenFunction();
  //     if (token) {
  //       const user = await getCurrentUser(token);
  //       console.log(typeof user);
  //       dispatch({
  //         type: "login",
  //         isAuthenticated: true,
  //         curUser: user,
  //         accessToken: token,
  //       });
  //     } else {
  //       // localStorage.setItem("isLoggedin", "");
  //       localStorage.removeItem("isLoggedin");
  //       setisLoggedBefore(false);
  //     }
  //   })();
  // }, [isLoggedBefore]);
  // -----------used before /|\ -----------------

  // useEffect(() => {
  //   async function getUserdata(token) {
  //     console.log(token);
  //     const res = await fetch(
  //       "https://application-tracker.fastapicloud.dev/users/me",
  //       {
  //         method: "GET",
  //         credentials: "include",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       },
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //   }
  //   if (accessToken) {
  //     setcurrentUser(getUserdata(accessToken));
  //   }
  // }, [accessToken]);

  return (
    <logincontext.Provider
      value={{
        accessToken,
        curUser,
        logout,
        login,
        isAuthenticated,
        isLoggedBefore,
        setisLoggedBefore,
        refreshTokenFunction,
        fetchRequestWrapper,
        addNewCompanyWithRefresh,
      }}
    >
      {children}
    </logincontext.Provider>
  );
}

function useLoginContext() {
  const context = useContext(logincontext);
  if (context === undefined) {
    throw new Error("Quick stats context used outside the provider");
  }
  return context;
}

export { LoginContextProvider, useLoginContext };
