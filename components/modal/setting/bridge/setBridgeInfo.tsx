import "react-tabulator/lib/styles.css";
import { PropsWithChildren, useEffect, useState } from "react";
import SetStep1 from "./contents/step1";
import SetStep2 from "./contents/step2";
import SetStep3 from "./contents/step3";
import SetStep4 from "./contents/step4";
import { SelectedDataContext } from "@/constant/context/selectedDataContext";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";
import useMultilingual, { LanguageType } from "@/hook/useMultilingual";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

interface ModalDefaultType {
  onClickToggleModal: () => void;
  callbackFunction: any;
}

function GrpModal({
  onClickToggleModal,
  callbackFunction,
}: PropsWithChildren<ModalDefaultType>) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [stepGbnData, setStepGbnData] = useState<any>([]);
  const [indexVal, setIndex] = useState(0);
  const [serverData, setServerData] = useState<any>();
  const [sourceTypeData, setSourceTypeData] = useState<any>();
  const [destinationTypeData, setDestinationTypeData] = useState<any>();
  const [sourceNameData, setSourceNameData] = useState<any>();
  const [destinationNameData, setDestinationNameData] = useState<any>();
  const [selectorData, setSelectorData] = useState<any>();
  const [onClickModal, setOnClickModal] = useState<boolean>(false);

  // 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const changeState = (value: any) => {
    setIndex(value);
  };

  if (onClickModal === true) {
    onClickToggleModal();
    localStorage.removeItem("selector");
    localStorage.removeItem("sourceType");
    localStorage.removeItem("destinationType");
  }

  const tabGbn = [
    {
      id: 0,
      title: "Select EMS Server",
      content: <SetStep1 changeState={changeState} />,
    },
    {
      id: 1,
      title: "Select Source",
      content: <SetStep2 changeState={changeState} />,
    },
    {
      id: 2,
      title: "Select Destination",
      content: <SetStep3 changeState={changeState} />,
    },
    {
      id: 3,
      title: "Result",
      content: (
        <SetStep4
          changeState={changeState}
          callbackFunction={callbackFunction}
          onClickToggleModal={onClickToggleModal}
        />
      ),
    },
  ];

  useEffect(() => {
    setStepGbnData(tabGbn);
  }, []);

  return (
    <>
      <SelectedDataContext.Provider
        value={{
          serverData,
          setServerData,
          sourceTypeData,
          setSourceTypeData,
          destinationTypeData,
          setDestinationTypeData,
          destinationNameData,
          setDestinationNameData,
          sourceNameData,
          setSourceNameData,
          selectorData,
          setSelectorData,
          onClickModal,
          setOnClickModal,
        }}
      >
        {/* <div className="modal_ly_bg"></div> */}
        <div className="modal_wrap">
          <div className="modal_wrapbox">
            <div className="modal-dialog">
              <div className="modal-content w_600">
                <div className="modal-header">
                  <h5 className="modal-title" id="staticBackdropLabel">
                    Add Bridge
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={(e) => {
                      e.preventDefault();
                      if (onClickToggleModal) {
                        onClickToggleModal();
                      }
                    }}
                  />
                </div>
                <div className="modal-body">
                  <div className="content__boxed">
                    <div className="row col-md-12 justify-content-center">
                      <div className="col-sm-4">
                        <div className="gap-1">
                          {stepGbnData.map((item: any) => (
                            <div
                              className={
                                item.id === indexVal
                                  ? "entry e_active"
                                  : "entry"
                              }
                              key={item.id}
                            >
                              {item.title}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="col-sm-8">
                        {stepGbnData
                          .filter((item: any) => indexVal === item.id)
                          .map((item: any) => (
                            <div className="ems-entry-left" key={item.id}>
                              {item.content}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer justify-content-center">
                  <div className="flex-wrap gap-2 mt-3 d-flex">
                    <button
                      type="button"
                      className="btn btn-light btn-lg"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onClickToggleModal) {
                          onClickToggleModal();
                          localStorage.removeItem("selector");
                          localStorage.removeItem("sourceType");
                          localStorage.removeItem("destinationType");
                        }
                      }}
                    >
                      {t("MUL_WD_0023")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SelectedDataContext.Provider>
    </>
  );
}

export default GrpModal;
