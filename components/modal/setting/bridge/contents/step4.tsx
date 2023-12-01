import "react-tabulator/lib/styles.css";
import { PropsWithChildren, useState } from "react";
import { useSelectedDataContext } from "@/constant/context/selectedDataContext";
import { parseCookies } from "nookies";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

interface ModalDefaultType {
  changeState: any;
  callbackFunction: any;
  onClickToggleModal: () => void;
}

function SetStep4({
  changeState,
  callbackFunction,
  onClickToggleModal,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  //타입 명시를 위해
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const [modal, setModal] = useState(false);

  const {
    serverData,
    sourceTypeData,
    destinationTypeData,
    sourceNameData,
    destinationNameData,
    selectorData,
    setOnClickModal,
  } = useSelectedDataContext();
  const srvrNm = serverData?.srvrNm;
  const srvrSn = serverData?.srvrSn;

  const fnPrev = () => {
    changeState(2);
  };

  const addBridgeInfo = () => {
    postModalDataAsync();
    setModal(true);
    setOnClickModal(modal);
    callbackFunction;
  };

  let bridgeUrl = `/api/setting/bridge/bridgeModalApi`;

  // 사용자 등록
  const postModalDataAsync = async () => {
    try {
      if (confirm(t("MUL_ST_0030") as string)) {
        const bodyData = {
          destination_name: destinationNameData,
          destination_type: destinationTypeData,
          selector: selectorData,
          source_name: sourceNameData,
          source_type: sourceTypeData,
          tib_srvr_sn: srvrSn,
          access_token: accessToken,
        };

        const res = await fetch(bridgeUrl, {
          body: JSON.stringify(bodyData),
          method: "POST",
        });

        const data = await res.json();

        if (data.code && data.code == 200) {
          alert(t("MUL_ST_0025"));

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        } else if (data.status === 404) {
          alert(t("MUL_ST_0027"));
        } else if (data.code === "J002") {
          alert(t("MUL_ST_0028"));
        } else {
          alert(t("MUL_ST_0029"));
        }
      }
    } catch (error) {
      console.error("에러 발생:", error);
      alert(t("MUL_ST_0026"));
    }
  };

  return (
    <>
      <div className="mb-2 row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="input_emsserver_m">
          EMS Server
        </label>
        <div className="col-sm-8">
          <div className="form-control">{srvrNm}</div>
        </div>
      </div>
      <div className="mb-2 row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="input_source_m">
          Source
        </label>
        <div className="col-sm-3">
          <div className="form-control">{sourceTypeData}</div>
        </div>
        <div className="col-sm-5">
          <div className="form-control">{sourceNameData}</div>
        </div>
      </div>
      <div className="mb-2 row col-sm-12">
        <label
          className="col-sm-4 col-form-label"
          htmlFor="input_destination_m"
        >
          Destination
        </label>
        <div className="col-sm-3">
          <div className="form-control">{destinationTypeData}</div>
        </div>
        <div className="col-sm-5">
          <div className="form-control">{destinationNameData}</div>
        </div>
      </div>
      <div className="mb-2 row col-sm-12">
        <label className="col-sm-4 col-form-label" htmlFor="input_emsserver_m">
          Selector
        </label>
        <div className="col-sm-8">
          <div className="form-control" style={{ height: 37.2 }}>
            {selectorData}
          </div>
        </div>
      </div>
      <div className="gap-1 mt-3 t_c">
        <button
          type="button"
          className="btn btn-sm btn-gray"
          onClick={() => fnPrev()}
          style={{ marginRight: "0.25rem" }}
        >
          Prev
        </button>
        <button
          type="button"
          className="btn btn-sm btn-gray"
          onClick={() => addBridgeInfo()}
        >
          Finish
        </button>
      </div>
    </>
  );
}

export default SetStep4;
function onClickToggleModal() {
  throw new Error("Function not implemented.");
}
