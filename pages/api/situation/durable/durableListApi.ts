import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { DUR_BROWSE, DUR_LIST } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let durableListUrl = `${process.env.API_URL}${DUR_LIST}`;
  let durableBrowsetUrl = `${process.env.API_URL}${DUR_BROWSE}`;

  if ("GET".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
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
  } else if ("GET_BROW".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      topic_nm: bodyData.topic_nm,
      durab_nm: bodyData.durab_nm,
      clnt_id: bodyData.clnt_id,
    };

    await axios
      .get(durableBrowsetUrl, {
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
