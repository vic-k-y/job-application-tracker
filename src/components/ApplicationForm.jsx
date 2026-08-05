import { useState } from "react";
import styles from "./ApplicationForm.module.css";
import CloseXBtn from "./CloseXBtn";
import Toast from "./Toast";
import { useGeneralContext } from "../context/GeneralContext";
import { useId } from "react";
import { useLoginContext } from "../context/LoginContext";
import { addCompany } from "../utlis/utlls";
import progress_icon from "../assets/progress_activity_24dp.svg";

// {
//     "title": "Full stack developer",
//     "description": "detailed description about the job.",
//     "company_name": "Freshworks",
//     "company_id": 1,
//     "location": "chennai",
//     "source": "Naukri",
//     "application_url": "https://naukri.com/job-url",
//     "applied_via": "Naukri",
//     "status": "No reply",
//     "addition_info": "add your notes, things to remember like connected with recruiter via linkedin etc.",
//     "applied_at": "2026-08-02T07:14:50.731335Z",
//     "id": 0
//   }

function ApplicationForm() {
  const {
    addError,
    setError,
    allCompany,
    setallCompany,
    setallApplications,
    setshowApplicationForm,
    editApplicationData,
    seteditApplicationData,
  } = useGeneralContext();
  const {
    curUser,
    accessToken,
    refreshTokenFunction,
    logout,
    fetchRequestWrapper,
    addNewCompanyWithRefresh,
  } = useLoginContext();
  // ------------- controlled input -----------
  const [titleValue, settitleValue] = useState(
    editApplicationData ? editApplicationData["title"] : "",
  );
  const [descriptionValue, setdescriptionValue] = useState(
    editApplicationData ? editApplicationData["description"] : "",
  );
  const [companyName, setcompanyName] = useState(
    editApplicationData ? editApplicationData["company_name"] : "",
  );
  const [companyId, setcompanyId] = useState(
    editApplicationData ? editApplicationData["company_id"] : "",
  );
  const [locationValue, setlocationValue] = useState(
    editApplicationData ? editApplicationData["location"] : "",
  );
  const [sourceValue, setsourceValue] = useState(
    editApplicationData ? editApplicationData["source"] : "",
  );
  const [appUrl, setappUrl] = useState(
    editApplicationData ? editApplicationData["application_url"] : "",
  );
  const [appliedVia, setappliedVia] = useState(
    editApplicationData ? editApplicationData["applied_via"] : "",
  );
  const [additionalValue, setadditionalValue] = useState(
    editApplicationData ? editApplicationData["addition_info"] : "",
  );

  const [statusValue, setstatusValue] = useState(
    editApplicationData ? editApplicationData["status"] : "",
  );
  const statusList = [
    "Not Applied",
    "Applied",
    "No Reply",
    "Rejected",
    "Interviewing",
    "Selected",
  ];

  // -------------------- for edit application form ---------------------
  const [oldData, _] = useState(
    editApplicationData
      ? {
          title: editApplicationData["title"],
          description: editApplicationData["description"],
          company_name: editApplicationData["company_name"],
          company_id: editApplicationData["company_id"],
          location: editApplicationData["location"],
          source: editApplicationData["source"],
          application_url: editApplicationData["application_url"],
          applied_via: editApplicationData["applied_via"],
          status: editApplicationData["status"],
          addition_info: editApplicationData["addition_info"],
        }
      : "",
  );
  let isEditForm = false;
  if (editApplicationData) {
    isEditForm = true;
    // console.log("print...");
    // console.log(editApplicationData);
    // setisEditForm(true);
    // console.log(JSON.stringify(editApplicationData));
    // settitleValue(editApplicationData["title"]);
    // setdescriptionValue(editApplicationData["description"]);
  }

  async function handleFormEditSubmit(e) {
    e.preventDefault();
    setisSubmitDisabled(true); // this will disable submit btn
    const appId = editApplicationData["id"];
    const newData = {
      title: titleValue,
      description: descriptionValue,
      company_name: companyName,
      company_id: companyId,
      location: locationValue,
      source: sourceValue,
      application_url: appUrl,
      applied_via: appliedVia,
      status: statusValue,
      addition_info: additionalValue,
    };
    // console.log(newData);
    // console.log("old data", oldData);
    const strOld = JSON.stringify(oldData);
    const strNew = JSON.stringify(newData);
    // console.log(strOld === strNew ? "yes same" : "no");
    if (strOld === strNew) {
      addError("No change found", true);
    } else {
      // console.log(strNew);
      try {
        const res = await fetchRequestWrapper(
          `https://application-tracker.fastapicloud.dev/application/${appId}`,
          "PATCH",
          {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          newData,
        );
        const val = await res.json();
        // if(!)
        setallApplications((items) =>
          items.map((item) => {
            if (item["id"] === val["id"]) return val;
            return item;
          }),
        );
        addError("Application modified");
        applicationFormClose();
      } catch (err) {
        // console.log(err);
        addError(err, true);
        throw err;
      } finally {
        setisSubmitDisabled(false);
      }
    }
    setTimeout(() => {
      setError();
    }, 2000);
  }

  // -------------------------------------------------------------------

  const [isSubmitDisabled, setisSubmitDisabled] = useState(false);

  const [showCompanyList, setshowCompanyList] = useState([]);
  const lis = allCompany.map((i) => i["name"]);
  // console.log(lis);
  function handleCompanyName(e) {
    const text = e.target.value;
    setcompanyName(text);
    if (text === "") {
      setshowCompanyList([]);
      return;
    }

    const matches = lis.filter((i) =>
      i.toLowerCase().includes(text.toLowerCase()),
    );
    setshowCompanyList(matches);
  }

  function handleSetCompanyNamefromList(e) {
    const val = e.target.closest("p").textContent;
    // console.log(val);
    if (val !== "Add this company") {
      setcompanyName(val);
      setshowCompanyList([]);

      const z = allCompany.filter((item) => item.name === val);
      // console.log(z[0]["id"]);
      setcompanyId(z[0]["id"]);
    }
    // setcompanyName(value);
  }

  function handleReset() {
    settitleValue("");
    setdescriptionValue("");
    setcompanyId("");
    setcompanyName("");
    setlocationValue("");
    setsourceValue("");
    setappUrl("");
    setappliedVia("");
    setstatusValue("");
    setadditionalValue("");
  }

  function applicationFormClose() {
    setshowApplicationForm(false);
    seteditApplicationData();
    // setisEditForm(false)
  }

  function handleApplicationFormClose(e) {
    // console.log(e.target.className.includes("closeModel"));
    if (e.target.className.includes("closeModel")) {
      applicationFormClose();
    }
  }

  async function handleFormData(e) {
    e.preventDefault();
    setisSubmitDisabled(true);
    const date = new Date();
    const userId = curUser["id"];

    // ?----------------
    let compId = null;
    if (!companyId) {
      // console.log(accessToken);
      const resBody = { name: companyName };
      // const newCompany = await addCompany(companyName, accessToken, resBody);
      const newCompany = await addNewCompanyWithRefresh(resBody);
      // console.log(newCompany);
      setallCompany((item) => [...item, newCompany]);
      await setcompanyId(newCompany["id"]);
      compId = newCompany["id"];
    }

    const data = {
      title: titleValue,
      description: descriptionValue || null,
      company_name: companyName,
      location: locationValue,
      source: sourceValue,
      application_url: appUrl || null,
      applied_via: appliedVia || null,
      status: statusValue,
      addition_info: additionalValue || null,
      applied_at: date.toISOString(),
      user_id: userId,
    };
    // console.log(data);
    // console.log(accessToken);
    try {
      // const res = await fetch(
      //   "https://application-tracker.fastapicloud.dev/application",
      //   {
      //     method: "POST",
      //     headers: {
      //       Accept: "application/json",
      //       Authorization: `Bearer ${accessToken}`,
      //       "Content-Type": "application/json",
      //     },
      //     // body: data,
      //     body: JSON.stringify({ ...data, company_id: companyId }),
      //   },
      // );
      const head = {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      };
      // if(!companyId) setcompanyId(newCompany["id"]);
      const bodyData = { ...data, company_id: companyId || compId };
      // console.log(bodyData);
      const res = await fetchRequestWrapper(
        "https://application-tracker.fastapicloud.dev/application",
        "POST",
        head,
        bodyData,
      );
      const val = await res.json();
      if (res.ok) {
        // console.log(val);
        setallApplications((item) => [val, ...item]);
        addError("Added successfully", false);
        applicationFormClose();
      }
      if (!res.ok) throw Error;
    } catch {
      addError("error submitting Application", true);
    } finally {
      setisSubmitDisabled(false);
    }
    setTimeout(() => {
      setError();
    }, 2000);
    // console.log("form submit");
  }

  return (
    <>
      {/* {<Toast errorValue={"error"} />} */}
      <div
        className={`${styles.headDiv} closeModel`}
        onClick={handleApplicationFormClose}
      >
        <form
          className={styles.formclass}
          onSubmit={isEditForm ? handleFormEditSubmit : handleFormData}
          // onSubmit={(e) => {
          //   e.preventDefault();
          //   // setError({value})
          //   addError("adding form data", true);
          //   setTimeout(() => {
          //     setError();
          //   }, 2000);
          //   console.log("form submit");
          // }}
        >
          {/* <div className=></div> */}
          <CloseXBtn handler={applicationFormClose} />
          <p className={styles.headP}>Add new application:</p>
          <div className={styles.formFirstDiv}>
            <div className={styles.formIndDic}>
              <label htmlFor="title">Job title:</label>
              <input
                className="inputClass"
                type="text"
                id="title"
                onChange={(e) => settitleValue(e.target.value)}
                value={titleValue}
                required
              />
            </div>
            <div className={styles.formIndDic}>
              <label htmlFor="location">location:</label>
              <input
                className="inputClass"
                type="text"
                id="location"
                onChange={(e) => setlocationValue(e.target.value)}
                value={locationValue}
                required
              />
            </div>
            <div className={styles.formIndDic}>
              <label htmlFor="companyName">company name:</label>
              <div className={styles.CompanyInputDiv}>
                <input
                  className="inputClass"
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={companyName}
                  required
                  onChange={handleCompanyName}
                  disabled={isEditForm}
                />
                {showCompanyList.length > 0 && (
                  <div
                    className={styles.CompanyInputList}
                    onClick={handleSetCompanyNamefromList}
                  >
                    {showCompanyList.map((i) => (
                      <p key={i}>{i}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.formIndDic}>
            <label htmlFor="description">description:</label>
            <textarea
              className={`inputClass ${styles.textArea}`}
              name="description"
              id="description"
              onChange={(e) => setdescriptionValue(e.target.value)}
              value={descriptionValue}
              spellCheck={true}
            ></textarea>
          </div>
          <div className={styles.formFirstDiv}>
            <div className={styles.formIndDic}>
              <label htmlFor="source">source:</label>
              <input
                className="inputClass"
                type="text"
                id="source"
                onChange={(e) => setsourceValue(e.target.value)}
                value={sourceValue}
                placeholder="Naukri"
              />
            </div>
            <div className={styles.formIndDic}>
              <label htmlFor="appUrl">Apply link:</label>
              <input
                className="inputClass"
                type="url"
                id="appUrl"
                onChange={(e) => setappUrl(e.target.value)}
                value={appUrl || ""}
              />
            </div>
            <div className={styles.formIndDic}>
              <label htmlFor="appliedVia">Apply via:</label>
              <input
                className="inputClass"
                type="text"
                id="appliedVia"
                onChange={(e) => setappliedVia(e.target.value)}
                value={appliedVia}
              />
            </div>
          </div>
          <div className={styles.formFirstDiv}>
            <div className={styles.formIndDic}>
              <label htmlFor="additionalValue">Add notes:</label>
              <textarea
                className={`inputClass ${styles.textArea}`}
                name="additionalValue"
                id="additionalValue"
                onChange={(e) => setadditionalValue(e.target.value)}
                value={additionalValue}
                spellCheck={true}
              ></textarea>
            </div>
            <div className={`${styles.formIndDic} ${styles.statusDropdwonDiv}`}>
              <label htmlFor="statusValue">status:</label>
              <select
                required
                name="statusValue"
                id="statusValue"
                className={styles.statusDropdown}
                onChange={(e) => setstatusValue(e.target.value)}
                value={statusValue}
              >
                <option value="">Choose status</option>
                {statusList.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* <button>submit</button> */}
          <div className={styles.btnDiv}>
            {!isEditForm && (
              <button
                type="reset"
                className={styles.clearBtn}
                onClick={handleReset}
              >
                clear
              </button>
            )}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitDisabled}
              // style={
              //   isSubmitDisabled ? { opacity: "40%" } : { opacity: "100%" }
              // }
            >
              {isSubmitDisabled ? (
                <img
                  className={styles.progressIcon}
                  src={progress_icon}
                  alt="loading icon"
                />
              ) : (
                "submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ApplicationForm;
