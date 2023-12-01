import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { TOP_CHART, TOP_HIST, TOP_HIST_EXCEL } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let topicCharttUrl = `${process.env.API_URL}${TOP_CHART}`;
  let topicHistUrl = `${process.env.API_URL}${TOP_HIST}`;
  let topicExcelUrl = `${process.env.AAPI_URL}${TOP_HIST_EXCEL}`;

  if ("GET_CHART".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      start_date: bodyData.start_date,
      end_date: bodyData.end_date,
    };

    await axios
      .get(topicCharttUrl, {
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
  } else if ("GET_HIST".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
      pattern: bodyData.pattern,
      name: bodyData.name,
      start_date: bodyData.start_date,
      end_date: bodyData.end_date,
    };

    await axios
      .get(topicHistUrl, {
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
  } else if ("GET_EXCEL".match(caseType)) {
    const getParamsVal = {
      tib_srvr_list: bodyData.tib_srvr_list,
      pattern: bodyData.pattern,
      name: bodyData.name,
      start_date: bodyData.start_date,
      end_date: bodyData.end_date,
    };

    await axios
      .get(topicExcelUrl, {
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
