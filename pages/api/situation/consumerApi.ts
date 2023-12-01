import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { CNSMR_LIST, CONNECTION } from "../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let consumerListUrl = `${process.env.API_URL}${CNSMR_LIST}`;
  let connectUrl = `${process.env.API_URL}${CONNECTION}`;

  if ("GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      pattern: bodyData.pattern,
      type: bodyData.type,
    };

    await axios
      .get(consumerListUrl, {
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
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("GET_PROP".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      connect_id: bodyData.connect_id,
    };

    await axios
      .get(connectUrl, {
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
          res.status(error.response.status).json(error.response.data);
        }
      });
  }
}
