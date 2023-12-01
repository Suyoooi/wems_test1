import type { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { useCallback, useEffect, useState } from "react";
import qs from "qs";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let srvrListUrl = `${process.env.API_URL}/tibco/ems/srvr`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
      hostname: bodyData.hostname,
    };

    await axios
      .get(srvrListUrl, {
        params: getParamsVal,
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
      srvr_alias: bodyData.srvrAlias,
      srvr_ht_nm: bodyData.srvrHtNm,
      srvr_ipaddr: bodyData.srvrIpaddr,
      srvr_port: bodyData.srvrPort,
      srvr_desc: bodyData.srvrDesc,
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
    const putParamsVal = {
      srvr_alias: bodyData.srvrAlias,
      srvr_ht_nm: bodyData.srvrHtNm,
      srvr_ipaddr: bodyData.srvrIpaddr,
      srvr_port: bodyData.srvrPort,
      srvr_desc: bodyData.srvrDesc,
    };

    const url = srvrListUrl.concat("/").concat(bodyData.srvrSn);

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
    const delUrl = srvrListUrl.concat("/").concat(bodyData.delSrvrSn);

    axios
      .delete(delUrl)
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
