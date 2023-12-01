import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function SrvrCdList() {
  // 언어 선택
  const lang = useSelector(
    (state: { lang: { lang: LanguageType } }) => state.lang.lang
  );
  const t = useMultilingual(lang);

  const [gprCdLst, setGrpCdLst] = useState<any[]>([]);
  let grpInfoUrl = `/api/setting/ems/groupListApi`;

  const fetchSrvrCdList = async () => {
    try {
      const bodyData = {
        case_method: "GET",
      };

      const res = await fetch(grpInfoUrl, {
        body: JSON.stringify(bodyData),
        method: "POST",
      });

      const data = await res.json();
      const dataInfo = data.data;

      setGrpCdLst(dataInfo);
    } catch (err) {
      console.error("Error fetching table data:", err);
    }
  };

  useEffect(() => {
    fetchSrvrCdList();
  }, []);

  return (
    <>
      <option value="" key="all">
        == {t("MUL_WD_0010")} ==
      </option>
      {gprCdLst &&
        gprCdLst.map((grpCd) => (
          <option value={grpCd.grp_sn} key={grpCd.grp_nm}>
            {grpCd.grp_nm}
          </option>
        ))}
    </>
  );
}
