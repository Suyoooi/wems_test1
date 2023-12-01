import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
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

  let bridgeListUrl = `${process.env.API_URL}/tibco/ems/bridge`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
      ems_qt: bodyData.ems_qt,
      source_name: bodyData.source_name,
    };

    await axios
      .get(bridgeListUrl, {
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
      .post(bridgeListUrl, getParamsVal, {
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
  } else if ("DEL".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      source_name: bodyData.source_name,
      source_type: bodyData.source_type,
      destination_name: bodyData.destination_name,
      destination_type: bodyData.destination_type,
      selector: bodyData.selector,
    };

    axios
      .delete(bridgeListUrl, {
        data: getParamsVal,
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
