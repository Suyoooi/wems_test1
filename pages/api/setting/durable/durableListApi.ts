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

  let durableListUrl = `${process.env.API_URL}/tibco/ems/durab`;
  let browseListUrl = `${process.env.API_URL}/monitor/durable/browse`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
      name: bodyData.name,
    };

    await axios
      .get(durableListUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
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
  } else if ("BROW_GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      topic_nm: bodyData.topic_nm,
      durab_nm: bodyData.durab_nm,
      clnt_id: bodyData.clnt_id,
    };

    await axios
      .get(browseListUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
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
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      durable_name: bodyData.durable_name,
      topic_name: bodyData.topic_name,
      client_id: bodyData.client_id,
      selector: bodyData.selector,
    };

    await axios
      .post(durableListUrl, getParamsVal, {
        headers: headerInfo,
      })
      .then(function (response) {
        if (response.data.code === 200) {
          res.status(200).json(response.data);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("PUT".match(caseType)) {
    const getParamsVal = {
      durab_info_list: bodyData.durab_info_list,
    };

    await axios
      .patch(durableListUrl, getParamsVal, {
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
  } else if ("DEL".match(caseType)) {
    axios
      .delete(durableListUrl, {
        data: {
          durab_info_list: bodyData.durab_info_list,
        },
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
