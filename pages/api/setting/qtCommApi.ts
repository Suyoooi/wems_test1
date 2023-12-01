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

  let qtSetUrl = `${process.env.API_URL}/tibco/ems/`;

  let grpUrl = `${process.env.API_URL}/tibco/ems/tib-srvr/group`;

  let qInfoUrl = `${process.env.API_URL}/monitor/queue`;
  let tInfoUrl = `${process.env.API_URL}/monitor/topic`;

  let qTblUrl = `${process.env.API_URL}/tibco/ems/queue/property/list`;
  let tTblUrl = `${process.env.API_URL}/tibco/ems/topic/property/list`;
  let qPropUrl = `${process.env.API_URL}/tibco/ems/queue/property_list`;
  let tPropUrl = `${process.env.API_URL}/tibco/ems/topic/property_list`;
  let qPropList = `${process.env.API_URL}/tibco/ems/queue/property/prop`;
  let tPropList = `${process.env.API_URL}/tibco/ems/topic/property/prop`;

  let guList = `${process.env.API_URL}/tibco/ems/user-group`;

  let setPermission = `${process.env.API_URL}/tibco/ems/permission`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      alias: bodyData.alias,
      name: bodyData.name,
    };

    await axios
      .all([
        axios.get(qTblUrl, {
          params: getParamsVal,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        }),
        axios.get(tTblUrl, {
          params: getParamsVal,
          paramsSerializer: (params) => {
            return qs.stringify(params, { arrayFormat: "repeat" });
          },
        }),
        axios.get(qPropUrl),
        axios.get(tPropUrl),
      ])
      .then(
        axios.spread((res1, res2, res3, res4) => {
          const qTblRes = res1.data;
          const tTblRes = res2.data;
          const qPropRes = res3.data;
          const tPropRes = res4.data;
          const resData = [qTblRes, tTblRes, qPropRes, tPropRes];
          res.status(200).json(resData);
        })
      )
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("PERMISSION".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      name: bodyData.name,
      principal: bodyData.principal,
    };

    const emsQt = bodyData.ems_qt;
    let guPermission = qtSetUrl.concat(emsQt).concat("/permission");

    await axios
      .get(guPermission, {
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
  } else if ("SET_PERM".match(caseType)) {
    const postParamsVal = {
      ems_qt: bodyData.ems_qt,
      grant_list: bodyData.grant_list,
      group_list: bodyData.group_list,
      name: bodyData.name,
      tib_srvr_sn: bodyData.tib_srvr_sn,
      user_list: bodyData.user_list,
    };

    await axios
      .post(setPermission, postParamsVal, {
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
  } else if ("QU_PROP".match(caseType)) {
    const postParamsVal = {
      info: bodyData.info,
      property: bodyData.property,
    };

    await axios
      .post(qPropList, postParamsVal, {
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
  } else if ("TO_PROP".match(caseType)) {
    const postParamsVal = {
      info: bodyData.info,
      property: bodyData.property,
    };

    await axios
      .post(tPropList, postParamsVal, {
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
    const postUrl = qtSetUrl.concat(bodyData.emsQT);

    const postParamsVal = {
      name: bodyData.name,
      tib_srvr_list: bodyData.tib_srvr_list,
    };

    await axios
      .post(postUrl, postParamsVal, {
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
  } else if ("GRP_USER".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
    };

    await axios
      .get(guList, {
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
  } else if ("POST".match(caseType)) {
    const postUrl = qtSetUrl.concat(bodyData.emsQT);

    const postParamsVal = {
      name: bodyData.name,
      tib_srvr_list: bodyData.tib_srvr_list,
    };

    await axios
      .post(postUrl, postParamsVal, {
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
    const putParamsVal = {
      des_pur_list: bodyData.des_pur_list,
    };

    const putUrl = qtSetUrl.concat(bodyData.emsQT);

    await axios
      .put(putUrl, putParamsVal, {
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
    const delUrl = qtSetUrl.concat(bodyData.emsQT);
    axios
      .delete(delUrl, {
        data: {
          des_pur_list: bodyData.des_pur_list,
        },
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
