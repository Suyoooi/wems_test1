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
  const accessToken = bodyData.accToken;

  let topicListUrl = `${process.env.API_URL}/monitor/topic`;
  let topicPropUrl = `${process.env.API_URL}/tibco/ems/topic/group/property`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Authorization: `Bearer ${accessToken}`,
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.emsSrvrList,
      pattern: bodyData.pattern,
      name: bodyData.name,
    };

    await axios
      .get(topicListUrl, {
        params: getParamsVal,
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
  } else if ("CHG_PROP_GET".match(caseType)) {
    const getParamsVal = {
      grp_sn_list: bodyData.grp_sn_list,
      alias: bodyData.alias,
      name: bodyData.name,
    };

    await axios
      .get(topicPropUrl, {
        params: getParamsVal,
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
  }
}
