import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import {
  ALL_SRVR,
  TIB_SRVR,
  TIB_SRVR_GRP,
  TIB_SRVR_INFO,
  TIB_SRVR_PROP,
} from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;
  const accessToken = bodyData.accToken;

  let srvrListUrl = `${process.env.API_URL}${TIB_SRVR}`;
  let emsSrvrListUrl = `${process.env.API_URL}${ALL_SRVR}`;
  let grpUrl = `${process.env.API_URL}${TIB_SRVR_GRP}`;
  let propUrl = `${process.env.API_URL}${TIB_SRVR_PROP}`;
  let srvrPropInfoUrl = `${process.env.API_URL}${TIB_SRVR_INFO}`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${accessToken}`,
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
    };

    await axios
      .get(emsSrvrListUrl, {
        params: getParamsVal,
        headers: headerInfo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        // if (error) {
        //   res.status(error.response.status).json(error.response.data);
        // }
      });
  } else if ("GRP_GET".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
      grp_sn_list: bodyData.grp_sn_list,
    };

    await axios
      .all([
        axios.get(srvrListUrl, {
          params: getParamsVal,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
          headers: headerInfo,
        }),
        axios.get(grpUrl),
      ])
      .then(
        axios.spread((res1, res2) => {
          const sRes = res1.data;
          const gRes = res2.data;

          console.log(sRes);
          console.log(gRes);

          const resData = [sRes, gRes];
          res.status(200).json(resData);
        })
      )
      .catch(function (error) {
        console.log(error);
      });
  } else if ("SRVR_GET".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
      grp_sn_list: bodyData.grp_sn_list,
    };

    await axios
      .get(srvrListUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        headers: headerInfo,
      })
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("PROP_GET".match(caseType)) {
    const url = srvrListUrl.concat("/").concat(bodyData.tib_srvr_sn);

    await axios
      .get(url, {
        headers: headerInfo,
      })
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("MT_PROP".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
    };

    await axios
      .all([
        axios.get(srvrListUrl, {
          params: getParamsVal,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
          headers: headerInfo,
        }),
        axios.get(propUrl),
      ])
      .then(
        axios.spread((res1, res2) => {
          const sRes = res1.data;
          const pRes = res2.data;
          const resData = [sRes, pRes];
          res.status(200).json(resData);
        })
      )
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("SRVR_PROP".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
    };

    await axios
      .get(srvrPropInfoUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        headers: headerInfo,
      })
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("POST".match(caseType)) {
    const postParamsVal = {
      grp_sn: bodyData.grp_sn,
      srvr_sn: bodyData.srvr_sn,
      // tib_srvr_sn: bodyData.tib_srvr_sn,
      tib_srvr_alias: bodyData.tib_srvr_alias,
      tib_srvr_url: bodyData.tib_srvr_url,
      tib_user_id: bodyData.tib_user_id,
      tib_user_pwd: bodyData.tib_user_pwd,
      tib_srvr_mntr_yn: bodyData.tib_srvr_mntr_yn,
      tib_srvr_sys_event_yn: bodyData.tib_srvr_sys_event_yn,
    };

    await axios
      .post(srvrListUrl, postParamsVal, {
        headers: headerInfo,
      })
      .then(async function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("PATCH".match(caseType)) {
    const patchParamsVal = {
      be_grp_sn: bodyData.be_grp_sn,
      grp_sn: bodyData.grp_sn,
      srvr_sn: bodyData.srvr_sn,
      tib_srvr_sn: bodyData.tib_srvr_sn,
      tib_srvr_alias: bodyData.tib_srvr_alias,
      tib_srvr_url: bodyData.tib_srvr_url,
      tib_user_id: bodyData.tib_user_id,
      tib_user_pwd: bodyData.tib_user_pwd,
      tib_srvr_mntr_yn: bodyData.tib_srvr_mntr_yn,
      tib_srvr_sys_event_yn: bodyData.tib_srvr_sys_event_yn,
    };

    await axios
      .patch(srvrListUrl, patchParamsVal, {
        headers: headerInfo,
      })
      .then(async function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("SET_PROP".match(caseType)) {
    const putParamsVal = {
      property: bodyData.property,
      srvr_info_list: bodyData.srvr_info_list,
    };

    const url = srvrListUrl.concat("/property");

    await axios
      .patch(url, putParamsVal, {
        headers: headerInfo,
      })
      .then(async function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("DEL".match(caseType)) {
    const delUrl = srvrListUrl.concat("/").concat(bodyData.tib_srvr_sn);
    axios
      .delete(delUrl, {
        headers: headerInfo,
      })
      .then(async function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  }
}
