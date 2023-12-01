import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { QUE_CHART, QUE_HIST, QUE_HIST_EXCEL } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let queueCharttUrl = `${process.env.API_URL}${QUE_CHART}`;
  let queueHistUrl = `${process.env.API_URL}${QUE_HIST}`;
  let queueExcelUrl = `${process.env.API_URL}${QUE_HIST_EXCEL}`;
  let queueChartTesttUrl = `${process.env.API_URL}/monitor/queue/chart2`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  if ("GET_CHART".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      start_date: bodyData.start_date,
      end_date: bodyData.end_date,
    };

    await axios
      .get(queueCharttUrl, {
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
      .get(queueHistUrl, {
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
      .get(queueExcelUrl, {
        params: getParamsVal,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
        headers: headerInfo,
        responseType: "blob",
      })
      .then(function (response) {
        // console.log(res);
        // console.log(response);
        // console.log(typeof response.data);
        // if (response.data.code === 200) {
        res.status(200).send(response);
        // }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if ("GET_CHART_TEST".match(caseType)) {
    const getParamsVal = {
      tib_srvr_sn: bodyData.tib_srvr_sn,
      start_date: bodyData.start_date,
      end_date: bodyData.end_date,
    };

    await axios
      .get(queueChartTesttUrl, {
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
