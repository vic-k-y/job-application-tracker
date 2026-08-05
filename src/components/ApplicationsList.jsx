import { useEffect } from "react";
import Application from "./Application";
import styles from "./ApplicationsList.module.css";
import { getAllApplications } from "../utlis/utlls";
import { useState } from "react";
import { useLoginContext } from "../context/LoginContext";
import { useGeneralContext } from "../context/GeneralContext";
import progress_icon from "../assets/progress_activity_24dp.svg";

function ApplicationsList() {
  // const { accessToken } = useLoginContext();
  const { allApplications, isApplicationsLoading } = useGeneralContext();
  // const data = [
  //   {
  //     title: "Full stack developer",
  //     description: "detailed description about the job.",
  //     company_name: "Freshworks",
  //     company_id: 1,
  //     location: "chennai",
  //     source: "Naukri",
  //     application_url: "https://naukri.com/job-url",
  //     applied_via: "Naukri",
  //     status: "No reply",
  //     addition_info:
  //       "add your notes, things to remember like connected with recruiter via linkedin etc.",
  //     applied_at: "2026-08-02T05:28:56.380124Z",
  //     id: 1,
  //   },
  //   {
  //     title: "Full stack developer",
  //     description: "detailed description about the job.",
  //     company_name: "Freshworks",
  //     company_id: 1,
  //     location: "chennai",
  //     source: "Naukri",
  //     application_url: "https://naukri.com/job-url",
  //     applied_via: "Naukri",
  //     status: "No reply",
  //     addition_info:
  //       "add your notes, things to remember like connected with recruiter via linkedin etc.",
  //     applied_at: "2026-08-02T05:28:56.380124Z",
  //     id: 2,
  //   },
  //   {
  //     title: "Full stack developer",
  //     description: "detailed description about the job.",
  //     company_name: "Freshworks",
  //     company_id: 1,
  //     location: "chennai",
  //     source: "Naukri",
  //     application_url: "https://naukri.com/job-url",
  //     applied_via: "Naukri",
  //     status: "No reply",
  //     addition_info:
  //       "add your notes, things to remember like connected with recruiter via linkedin etc.",
  //     applied_at: "2026-08-02T05:28:56.380124Z",
  //     id: 3,
  //   },
  // ];
  // const [data, setData] = useState([]);

  // async function fetchAllApp(token) {
  //   try {
  //     const appItems = await getAllApplications(token);
  //     console.log(appItems);
  //     if (appItems) setData(appItems);
  //   } catch {
  //     return null;
  //   }
  // }

  // const data = getAllApplications();
  return (
    // <div className={styles.listdiv}>
    <>
      {isApplicationsLoading ? (
        <div className={styles.loadingDiv}>
          <img
            src={progress_icon}
            alt="loading icon"
            className={styles.progressIcon}
          />
        </div>
      ) : allApplications.length > 0 ? (
        allApplications.map((item, index) => (
          <Application key={index} data={item} />
        ))
      ) : (
        <div className={styles.emptyDiv}>
          <div className={styles.emptyContent}>
            <p className={styles.p1}>nothing to show !</p>
            <p className={styles.p2}>create new application</p>
            <button className="btn">new</button>
          </div>
        </div>
      )}
    </>
    // </div>
  );
}

export default ApplicationsList;
