import "react-tabulator/lib/styles.css";

const GetTextBody = (props: any) => {
  const setData = props.setData;
  const bodyData = setData.sys_body.text_body;
  const textData = bodyData.text;

  return (
    <>
      <div id="textBodyForm">
        <textarea
          id="inResult"
          className="form-control h_180"
          placeholder=""
          rows={6}
          value={textData}
          disabled
        ></textarea>
      </div>
    </>
  );
};

export default GetTextBody;
