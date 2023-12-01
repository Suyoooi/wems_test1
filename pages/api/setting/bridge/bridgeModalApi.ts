import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { BRI_LIST, COMMON } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let bridgeUrl = `${process.env.API_URL}${BRI_LIST}`;
  let bridgeStep1Url = `${process.env.API_URL}${COMMON}/`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  };

  const accessToken = bodyData.access_token;

  if ("POST".match(caseType)) {
    const postParamsVal = {
      destination_name: bodyData.destination_name,
      destination_type: bodyData.destination_type,
      selector: bodyData.selector,
      source_name: bodyData.source_name,
      source_type: bodyData.source_type,
      tib_srvr_sn: bodyData.tib_srvr_sn,
    };

    await axios
      .post(bridgeUrl, postParamsVal, {
        headers: { ...headerInfo },
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
  } else if ("GET".match(caseType)) {
    const paramsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      ems_qt: bodyData.ems_qt,
    };

    // const url = bridgeStep1Url.concat(paramsVal.ems_qt);
    const url = `${process.env.API_URL}${COMMON}/${paramsVal.ems_qt}`;

    await axios
      .get(url, {
        params: paramsVal,
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
        // if (error) {
        //   res.status(error.response.status).json(error.response.data);
        // }
      });
  }
}
