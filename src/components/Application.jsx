import styles from "./Application.module.css";
import edit_icon from "../assets/edit_24dp.svg";
import { useState } from "react";
import { useGeneralContext } from "../context/GeneralContext";
import progress_icon from "../assets/progress_activity_24dp.svg";
import { useLoginContext } from "../context/LoginContext";

function Application({ data }) {
  const {
    setallApplications,
    setshowApplicationForm,
    seteditApplicationData,
    setError,
    addError,
  } = useGeneralContext();
  const { fetchRequestWrapper, accessToken } = useLoginContext();
  // const data = {
  //   title: "Full stack developer",
  //   description:
  //     "detailed description about the job.detailed description about the job.detailed description about the job.",
  //   company_name: "Freshworks",
  //   company_id: 1,
  //   location: "chennai",
  //   source: "Naukri",
  //   application_url: "",
  //   applied_via: "Naukri",
  //   status: "No reply",
  //   addition_info:
  //     "add your notes, things to remember like connected with recruiter via linkedin etc.",
  //   applied_at: "2026-08-02T05:28:56.380124Z",
  //   id: 1,
  // };

  // -------------------- open application form edit -----------------
  function handleApplicationEditBtn() {
    setshowApplicationForm(true);
    // console.log(data);
    const editD = {
      title: data["title"],
      description: data["description"],
      company_name: data["company_name"],
      company_id: data["company_id"],
      location: data["location"],
      source: data["source"],
      application_url: data["application_url"],
      applied_via: data["applied_via"],
      status: data["status"],
      addition_info: data["addition_info"],
      id: data["id"],
    };
    seteditApplicationData(editD);
  }

  // ------------------------------------------------------------------

  const [isExtend, setisExtend] = useState(false);
  const [isdeleteBtnDisabled, setisdeleteBtnDisabled] = useState(false);

  async function handleDeleteBtn(e) {
    e.preventDefault();
    setisdeleteBtnDisabled(true);
    const appId = data["id"];
    // console.log(appId, data["title"]);
    // addError("add error", true);
    try {
      const res = await fetchRequestWrapper(
        `https://application-tracker.fastapicloud.dev/application/${appId}`,
        "DELETE",
        { Authorization: `Bearer ${accessToken}` },
      );
      if (res.ok) addError("deleted");
      setisExtend(false);
      setallApplications((items) =>
        items.filter((item) => item["id"] !== appId),
      );
    } catch (err) {
      addError(err, true);
      // console.log(err);
      throw err;
    } finally {
      setisdeleteBtnDisabled(false);
    }

    setTimeout(() => {
      setError();
    }, 2000);
  }

  const date = new Date(data["applied_at"]);
  const formatted = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
  }).format(date);
  //   console.log(formatted);
  return (
    <>
      <div
        className={styles.topdiv}
        style={{
          border: `${isExtend ? "1px solid var(--border-light-grey)" : "None"}`,
          backgroundColor: `${isExtend ? "var(--input-backround-color)" : ""}`,
        }}
      >
        <div
          className={styles.application}
          onClick={() => setisExtend((e) => !e)}
        >
          <div className={styles.titleDiv}>
            <p className={styles.title}>{data["title"]}</p>
            {data["description"] && (
              <p className={styles.description}>
                {data["description"].length > 50
                  ? data["description"].slice(0, 50) + "..."
                  : data["description"]}
              </p>
            )}
          </div>
          <p className={styles.company}>{data["company_name"].toLowerCase()}</p>
          <div>
            <p>{data["status"]}</p>
            <p className={styles.date}>{formatted}</p>
          </div>
        </div>
        <button className={styles.editBtn} onClick={handleApplicationEditBtn}>
          {" "}
          <img src={edit_icon} alt="edit icon" /> edit
        </button>
      </div>
      {isExtend && (
        <div className={styles.extendDiv}>
          <div className={styles.oneItem}>
            <h5>description:</h5>
            <p>{data["description"] || "_"}</p>
          </div>
          <div className={styles.extendItem}>
            <div className={styles.oneItem}>
              <h5>company:</h5>
              <p>{data["company_name"]}</p>
            </div>
            <div className={styles.oneItem}>
              <h5>location:</h5>
              <p>{data["location"]}</p>
            </div>
            <div className={styles.oneItem}>
              <h5>source:</h5>
              <p>{data["source"] || "_"}</p>
            </div>
            <div className={styles.oneItem}>
              <h5>Job Url:</h5>
              <p>
                <a href={data["application_url"]} target="_blank">
                  {data["application_url"]?.slice(0, 30) || "_"}
                </a>
              </p>
            </div>
            <div className={styles.oneItem}>
              <h5>applied via:</h5>
              <p>{data["applied_via"] || "_"}</p>
            </div>
          </div>
          {data["addition_info"] && (
            <div className={styles.oneItem}>
              <h5>Notes:</h5>
              <p>{data["addition_info"] || "_"}</p>
            </div>
          )}
          <button
            className={styles.deletBtn}
            disabled={isdeleteBtnDisabled}
            onClick={handleDeleteBtn}
          >
            {isdeleteBtnDisabled ? (
              <img
                className="progressIcon"
                src={progress_icon}
                alt="loading icon"
              />
            ) : (
              "delete"
            )}
          </button>
        </div>
      )}
    </>
  );
}

export default Application;
