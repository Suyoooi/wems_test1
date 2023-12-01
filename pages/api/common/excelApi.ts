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
  const accessToken = bodyData.accToken;

  let queueUrl = `${process.env.API_URL}/monitor/queue/hist/excel`;
  let topicUrl = `${process.env.API_URL}/monitor/topic/hist/excel`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    responseType: "blob",
  };

  if ("QUEUE_GET".match(caseType)) {
    const excelListUrl = queueUrl.concat("?").concat(bodyData.paramVal);

    await axios
      .get(excelListUrl, {
        headers: headerInfo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(function (response) {
        const contentDisposition = response.headers["content-disposition"];
        const match = contentDisposition.match(/filename=(.+)/);
        const filename = match ? match[1] : "queue_history.xlsx";

        // const blobURL = URL.createObjectURL(new Blob([response.data]));

        const resArr = { resData: response.data, filenm: filename };
        // const resArr = { resHeader: response.headers, resData: response.data }
        // const resArr = { responVal: response }

        return res.status(200).send(resArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  } else if ("TOPIC_GET".match(caseType)) {
    const excelListUrl = topicUrl.concat("?").concat(bodyData.paramVal);

    await axios
      .get(excelListUrl, {
        headers: headerInfo,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: "repeat" });
        },
      })
      .then(function (response) {
        const resArr = { responVal: response };
        res.status(200).json(resArr);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
