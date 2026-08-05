import OneCompany from "./OneCompany";
import styles from "./CompanyList.module.css";
import add_icon from "../assets/add_icon.svg";
import close_icon from "../assets/close_24dp.svg";
import progress_icon from "../assets/progress_activity_24dp.svg";

import { useState } from "react";
import { useGeneralContext } from "../context/GeneralContext";
import { useLoginContext } from "../context/LoginContext";
import Toast from "./Toast";

function CompanyList() {
  const { addNewCompanyWithRefresh, fetchRequestWrapper, accessToken } =
    useLoginContext();
  const { error, addError, setError, allCompany, setallCompany } =
    useGeneralContext();

  const [inputName, setinputName] = useState("");
  const [inputUrl, setinputUrl] = useState("");
  function handleInputName(e) {
    setinputName(e.target.value);
  }
  function handleInputUrl(e) {
    setinputUrl(e.target.value);
  }

  const [submitBtnLoading, setsubmitBtnLoading] = useState(false);
  const [showEditCompany, setshowEditCompany] = useState(false);
  const [editSubmitBtnDisabled, seteditSubmitBtnDisabled] = useState(true);
  const [editFieldDisabled, seteditFieldDisabled] = useState(true);
  const [editDateOld, seteditDataOld] = useState();

  function closeEditModel() {
    setshowEditCompany(false);
    seteditSubmitBtnDisabled(true);
    seteditFieldDisabled(true);
    setinputName("");
    setinputUrl("");
  }

  function handleCloseEditModel(e) {
    if (e.target.id === "closeModel") {
      closeEditModel();
    }
  }
  async function handleEditCompanySubmit(e) {
    e.preventDefault();
    // console.log(editDateOld);
    const resUrl = `https://application-tracker.fastapicloud.dev/company/${editDateOld["id"]}`;
    const resMethod = "PATCH";
    const resHeaders = {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };
    const resBody = {
      ...(editDateOld["name"] !== inputName && { name: inputName }),
      ...(editDateOld["website"] !== inputUrl && { website: inputUrl }),
    };
    // console.log(resUrl, resHeaders, resBody);
    try {
      setsubmitBtnLoading(true);
      const res = await fetchRequestWrapper(
        resUrl,
        resMethod,
        resHeaders,
        resBody,
      );
      const val = await res.json();
      // console.log(val);
      // setallCompany(item => [...item, ])
      // const updatedCompany
      setallCompany((items) =>
        items.map((item) => (item.id === val.id ? val : item)),
      );
      addError("Company updated successfully", false);
      closeEditModel();
    } catch (err) {
      // console.log(err);
      addError(err.message);
      throw err;
    } finally {
      setsubmitBtnLoading(false);
      setTimeout(() => {
        setError();
      }, 2000);
    }
  }

  // -----------------------------------
  const [showAddCompany, setshowAddCompany] = useState(false);
  const [isAddCompany, setisAddCompany] = useState(false);
  function handleShowCompany() {
    // setisAddCompany(true);
    setinputName("");
    setinputUrl("");
    setshowAddCompany((e) => !e);
  }

  function handleCloseAddCompanyModel(e) {
    // setinputName('')
    // setinputUrl('')
    // console.log(e.target.id);
    if (e.target.id === "closeModel") {
      // setinputName("");
      // setinputUrl("");
      handleShowCompany();
    }
  }

  function handleAddCompany(e) {
    e.preventDefault();
    setsubmitBtnLoading(true);
    // console.log(inputName, inputUrl);
    const body = { name: inputName, website: inputUrl || "" };
    (async () => {
      try {
        const newCompany = await addNewCompanyWithRefresh(body);
        setallCompany((item) => [newCompany, ...item]);
        handleShowCompany();
        addError("New company added");
      } catch (err) {
        // console.log(err.message);
        addError(err.message, true);
      } finally {
        setsubmitBtnLoading(false);
        setTimeout(() => {
          setError();
        }, 2500);
      }
      // const newCompany = await res.json();
      // if (res.ok) {
      //   handleShowCompany();
      // }
      // if (!res.ok) console.log(res.status);
    })();
  }

  // const data = allCompany;
  // const data = [
  //   {
  //     id: 1,
  //     name: "Freshworks",
  //     website: "https://freshworks.com",
  //     logo_url: "https://freshworks.com/favicon.ico",
  //     no_of_applications: 0,
  //   },
  //   {
  //     id: 2,
  //     name: "zomato",
  //     website: "https://freshworks.com",
  //     logo_url: "https://freshworks.com/favicon.ico",
  //     no_of_applications: 0,
  //   },
  //   {
  //     id: 3,
  //     name: "swiggy",
  //     website: "https://freshworks.com",
  //     logo_url: "https://freshworks.com/favicon.ico",
  //     no_of_applications: 0,
  //   },
  // ];
  return (
    <>
      {/* {error && <Toast errorValue={error["value"]} error={error["iserror"]} />} */}
      {/* <div>hello</div> */}
      <div
        className={styles.topDiv}
        onClick={(e) => {
          // console.log(e.target.closest("div"));
          if (e.target.closest("div").className.includes("topDiv")) {
            setshowEditCompany(true);
            // setinputName
            const tarId = e.target.closest("div").id;
            // console.log(e.target.closest("div").id);
            allCompany.forEach((i) => {
              // console.log(i);
              if (i["id"] == tarId) {
                // console.log(i);
                seteditDataOld(i);
                setinputName(i["name"]);
                setinputUrl(i["website"]);
              }
            });
            // // setshowAddCompany(true);
            // setisAddCompany(false);
          }
        }}
      >
        <div className={styles.newCompany} onClick={handleShowCompany}>
          <img src={add_icon} alt="add icon" />
          <p>add new company</p>
        </div>
        {allCompany.length > 0 &&
          allCompany.map((i) => {
            //   console.log(i);
            return <OneCompany data={i} key={i["id"]} />;
          })}
        {/* <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} />
        <OneCompany data={data} /> */}
      </div>
      {/* ------------------ for add company ------------------ */}
      {showAddCompany && (
        <div
          className={styles.topModel}
          onClick={handleCloseAddCompanyModel}
          id="closeModel"
        >
          {/* <div className={styles.modelDiv}> */}
          <form className={styles.modelDiv} onSubmit={handleAddCompany}>
            <div
              className={styles.closeIconDiv}
              //   onClick={handleCloseAddCompanyModel}
            >
              <img src={close_icon} alt="close icon" id="closeModel" />
            </div>
            <p className={styles.addCompanyP}>Add new company</p>
            <input
              className={`${"inputClass"} ${styles.inputName}`}
              type="text"
              name="name"
              value={inputName}
              placeholder="company name"
              required
              onChange={handleInputName}
              // disabled={isEdit}
              // style={isEdit ? { opacity: "50%" } : { opacity: "100%" }}
            />
            <input
              className={`${"inputClass"} ${styles.inputUrl}`}
              type="url"
              name="website"
              value={inputUrl}
              placeholder="https://company.com (optional)"
              onChange={handleInputUrl}
              // disabled={isEdit}
              // style={isEdit ? { opacity: "50%" } : { opacity: "100%" }}
            />
            <div className={styles.btnDiv}>
              <button
                className={`${styles.btn} ${styles.clearBtn}`}
                type="reset"
                onClick={() => {
                  setinputName("");
                  setinputUrl("");
                }}
              >
                clear
              </button>

              <button
                className={styles.btn}
                type="submit"
                disabled={submitBtnLoading}
              >
                {submitBtnLoading ? (
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
          {/* </div> */}
        </div>
      )}
      {/* ======================================================================= */}
      {showEditCompany && (
        <div
          className={styles.topModel}
          onClick={handleCloseEditModel}
          id="closeModel"
        >
          <form className={styles.modelDiv} onSubmit={handleEditCompanySubmit}>
            <div className={styles.closeIconDiv}>
              <img src={close_icon} alt="close icon" id="closeModel" />
            </div>
            <p className={styles.addCompanyP}>company</p>
            <input
              className={`${"inputClass"} ${styles.inputName}`}
              type="text"
              name="name"
              value={inputName}
              placeholder="company name"
              required
              onChange={(e) => {
                handleInputName(e);
                if (e.target.value !== editDateOld["name"]) {
                  // console.log("diff website");
                  seteditSubmitBtnDisabled(() => {
                    return false;
                  });
                } else {
                  seteditSubmitBtnDisabled(() => {
                    if (editDateOld["website"] === inputUrl) return true;
                    return false;
                  });
                }
              }}
              disabled={editFieldDisabled}
              style={
                editFieldDisabled ? { opacity: "50%" } : { opacity: "100%" }
              }
            />
            <input
              className={`${"inputClass"} ${styles.inputUrl}`}
              type="url"
              name="website"
              value={inputUrl || ""}
              placeholder="https://company.com (optional)"
              onChange={(e) => {
                handleInputUrl(e);
                if (e.target.value !== editDateOld["website"]) {
                  // console.log("diff website");
                  seteditSubmitBtnDisabled(() => {
                    return false;
                  });
                } else {
                  seteditSubmitBtnDisabled(() => {
                    if (editDateOld["name"] === inputName) return true;
                    return false;
                  });
                }
              }}
              disabled={editFieldDisabled}
              style={
                editFieldDisabled ? { opacity: "50%" } : { opacity: "100%" }
              }
            />
            <div className={styles.btnDiv}>
              <button
                className={`${styles.btn} ${styles.clearBtn}`}
                type="button"
                onClick={() => {
                  seteditFieldDisabled(false);
                }}
              >
                edit
              </button>
              <button
                className={styles.btn}
                type="submit"
                disabled={editSubmitBtnDisabled || submitBtnLoading}
              >
                {submitBtnLoading ? (
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
          {/* </div> */}
        </div>
      )}
    </>
  );
}

export default CompanyList;
