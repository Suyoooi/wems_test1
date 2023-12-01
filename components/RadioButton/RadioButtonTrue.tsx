const RadioButtonTrue = () => {
  return (
    <>
      <div
        style={{
          cursor: "pointer",
          display: "block",
          // marginBottom: "0.125rem",
        }}
      >
        <div
          style={{
            float: "left",
            marginLeft: "-1.75em",
            width: "15px",
            height: "15px",
            backgroundColor: "white",
            borderRadius: "50%",
            border: "2px solid grey",
          }}
        >
          <div
            style={{
              position: "relative",
              top: "25%",
              left: "25%",
              width: "50%",
              height: "50%",
              backgroundColor: "grey",
              borderRadius: "50%",
            }}
          ></div>
        </div>
      </div>
    </>
  );
};

export default RadioButtonTrue;
