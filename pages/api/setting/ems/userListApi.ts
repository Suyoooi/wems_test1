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

  let userListUrl = `${process.env.API_URL}/tibco/ems/user`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("USER_GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
      username: bodyData.username,
    };

    await axios
      .get(userListUrl, {
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
  } else if ("PROP_GET".match(caseType)) {
    const propUrl = userListUrl.concat("/").concat(bodyData.tib_srvr_sn);
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      username: bodyData.username,
    };

    await axios
      .get(propUrl, {
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
  } else if ("USER_POST".match(caseType)) {
    const postParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      tibco_user_info_list: bodyData.tibco_user_info_list,
    };

    await axios
      .post(userListUrl, postParamsVal, {
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
  } else if ("PROP_POST".match(caseType)) {
    const permiUrl = userListUrl.concat("/permission");
    const postParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      principal: bodyData.principal,
      grant_list: bodyData.grant_list,
    };

    await axios
      .post(permiUrl, postParamsVal, {
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
  } else if ("USER_PUT".match(caseType)) {
    const putParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      username: bodyData.username,
      password: bodyData.password,
      description: bodyData.description,
    };

    await axios
      .patch(userListUrl, putParamsVal, {
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
    const paramData = {
      tibco_user_info_list: bodyData.tibco_user_info_list,
    };

    axios
      .delete(userListUrl, {
        data: paramData,
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
