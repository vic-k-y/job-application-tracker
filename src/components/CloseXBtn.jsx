import close_icon from "../assets/close_24dp.svg";

function CloseXBtn({ handler }) {
  return (
    <div
      onClick={handler}
      style={{
        border: "1px solid var(--border-light-grey)",
        // height: "20px",
        // width: "20px",
        position: "absolute",
        top: "2%",
        right: "2%",
        display: "flex",
        borderRadius: "50%",
        cursor: "pointer",
      }}
    >
      <img src={close_icon} alt="close icon" />
    </div>
  );
}

export default CloseXBtn;
