import styles from "./OneCompany.module.css";

function OneCompany({ data }) {
  //   console.log(data);
  return (
    <div className={styles.topDiv} id={data["id"]}>
      <div className={styles.profile}>{data["name"].slice(0, 2)}</div>
      <p>{data["name"]}</p>
    </div>
  );
}

export default OneCompany;
