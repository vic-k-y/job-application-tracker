import { useState } from "react";
import { createContext } from "react";
import Toast from "../components/Toast";
import { useContext } from "react";
import { useEffect } from "react";
import { getAllApplications, getAllCompanies } from "../utlis/utlls";
import { useLoginContext } from "./LoginContext";

const GeneralContext = createContext();

function GeneralContextProvider({ children }) {
  const { accessToken, fetchRequestWrapper } = useLoginContext();
  //   const [showToast, setshowToast] = useState(true);
  //   const [errorList, seterrorList] = useState([
  //     { value: "one error", error: false },
  //     { value: "two error", error: false },
  //   ]);
  //   console.log("run");
  //   function addError(data) {
  //     seterrorList((item) => [...item, data]);
  //   }
  //   const showToast = errorList.length > 0;
  //   return (
  //     <GeneralContext.Provider value={{ showToast, errorList }}>
  //       {children}
  //     </GeneralContext.Provider>
  //   );
  // -------------------------- for new application form model ------------------
  const [showApplicationForm, setshowApplicationForm] = useState(false);

  const demoApplications = [
    {
      addition_info:
        "add your notes, things to remember like connected with recruiter via linkedin etc.",
      application_url: "https://naukri.com/job-url",
      applied_at: "2026-07-30T10:37:13.086016Z",
      applied_via: "Naukri",
      company_id: 1,
      company_name: "Freshworks",
      description: "detailed description about the job.",
      id: 1,
      location: "chennai",
      source: "Naukri",
      status: "No Reply",
      title: "Full stack developer",
    },
    {
      addition_info:
        "connected with one employee in linkedin and asked for referal",
      application_url: "https://linkedin.com",
      applied_at: "2026-08-04T15:12:49.923000Z",
      applied_via: "Mail",
      company_id: 6,
      company_name: "geakminds",
      description:
        " Basic knowledge of Python\n • Familiarity with FastAPI or REST APIs\n • Understanding of SQL\n • Basic exposure to Cloud Platforms (AWS, Azure, or GCP)\n • Strong analytical and problem-solving skills\n • Excellent communication and a passion for learning",
      id: 9,
      location: "chennai",
      source: "linkedin",
      status: "Applied",
      title: "Freshers Developer (Python/ SQL)",
    },
  ];

  // -------------- edit application form ----------------
  const [editApplicationData, seteditApplicationData] = useState();
  // =================================================
  const [error, setError] = useState();

  function addError(value, iserror = false) {
    // console.log(value);
    setError({ value: value, iserror: iserror });
  }

  //   -------------------------------------------
  const [allCompany, setallCompany] = useState([]);
  // const [allApplications, setallApplications] = useState(demoApplications);
  const [allApplications, setallApplications] = useState([]);
  const [isApplicationsLoading, setisApplicationsLoading] = useState(true);

  async function fetchAllApp(token) {
    try {
      const appItems = await getAllApplications(token);
      // console.log(appItems);
      if (appItems) setallApplications(appItems);
    } catch {
      return null;
    }
  }

  async function fetchAllApplicatWithRefresh() {
    //   const res = await fetch(
    //   "https://application-tracker.fastapicloud.dev/application/all/user",
    //   { method: "GET", headers: { Authorization: `Bearer ${token}` } },
    // );
    // const val = await res.json();
    // if (res.ok) return val;
    // return null;
    const resUrl =
      "https://application-tracker.fastapicloud.dev/application/all/user";
    const resMethod = "GET";
    const resHeaders = { Authorization: `Bearer ${accessToken}` };

    try {
      const res = await fetchRequestWrapper(resUrl, resMethod, resHeaders);
      const appItems = await res.json();
      // console.log(appItems);
      if (appItems) setallApplications(appItems);
      return appItems;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  // uncheck
  useEffect(() => {
    (async () => {
      if (accessToken) {
        setisApplicationsLoading(true);
        const value = await getAllCompanies();
        // console.log(value);
        if (value) setallCompany(value);
        await fetchAllApplicatWithRefresh();
      }
      setisApplicationsLoading(false);
    })();
  }, [accessToken]);
  //   ------------------------------------------------

  return (
    <GeneralContext.Provider
      value={{
        error,
        setError,
        addError,
        allCompany,
        setallCompany,
        allApplications,
        setallApplications,
        showApplicationForm,
        setshowApplicationForm,
        editApplicationData,
        seteditApplicationData,
        isApplicationsLoading,
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
}

function useGeneralContext() {
  const context = useContext(GeneralContext);
  if (context === undefined) {
    throw new Error("general context used outside the provider");
  }
  return context;
}

export { GeneralContextProvider, useGeneralContext };
