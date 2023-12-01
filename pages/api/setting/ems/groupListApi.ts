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

  let grpListUrl = `${process.env.API_URL}/tibco/ems/tib-srvr/group`;
  let userInfoUrl = `${process.env.API_URL}/tibco/ems/user`;
  let setGrpInfoUrl = `${process.env.API_URL}/tibco/ems/user/group/user-to-group`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET".match(caseType)) {
    await axios
      .get(grpListUrl)
      .then(function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("USER_INFO".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_sn
    };

    await axios
    .get(userInfoUrl, {
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
    const postParamsVal = {
      grp_nm: bodyData.grpNm,
      description: bodyData.description,
    };

    await axios
      .post(grpListUrl, postParamsVal, {
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
  } else if ("ADD_USR".match(caseType)) {
    const putParamsVal = {
      group_name: bodyData.group_name,
      tib_srvr_sn: bodyData.tib_srvr_sn,
      user_name: bodyData.user_name_list
    };

    await axios
      .put(setGrpInfoUrl, putParamsVal, {
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
  } else if ("PUT".match(caseType)) {
  } else if ("DEL".match(caseType)) {
    const delUrl = grpListUrl.concat("/").concat(bodyData.grpSn);
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
