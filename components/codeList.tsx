import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function CodeList(props: any) {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);
  const [codeLst, setCodeLst] = useState<any[]>([]);
  const fetchCodeList = async () => {
    try {
      let codeInfoUrl = `/api/common/codeApi`;

      const bodyData = {
        case_method: "GET",
        cdId: props.codeGroupId,
      };

      const res = await fetch(codeInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setCodeLst(dataInfo);
    } catch (e) {
      console.log("error");
    }
  };

  useEffect(() => {
    fetchCodeList();
  }, []);

  return (
    <>
      <option value="" key="all">
        == {t("MUL_WD_0010")} ==
      </option>
      {codeLst &&
        codeLst.map((code) => (
          <option value={code.cd_id} key={code.cd_id}>
            {code.cd_nm}
          </option>
        ))}
    </>
  );
}
