import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { TIB_SRVR, TIB_SRVR_GRP } from "../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let tibSrvrListUrl = `${process.env.API_URL}${TIB_SRVR}`;
  let tibSrvrGrpUrl = `${process.env.API_URL}${TIB_SRVR_GRP}`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET_LIST".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
      grp_sn_list: bodyData.grp_sn_list,
    };

    await axios
      .get(tibSrvrListUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(function (response) {
        if (response.data.code === 200) {
          res.status(200).json(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
        // if (errorerror) {
        //   res.status(error.response).json(error.response.data);
        // }
      });
  } else if ("GET_GROUP".match(caseType)) {
    const getParamsVal = {};

    await axios
      .get(tibSrvrGrpUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(function (response) {
        if (response.data.code === 200) {
          res.status(200).json(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          //   res.status(error.response.status).json(error.response.data);
        }
      });
  }
}
