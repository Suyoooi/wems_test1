import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { QUE_BROWSE } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);

  let queueBrowseUrl = `${process.env.API_URL}${QUE_BROWSE}`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
  };

  const getParamsVal = {
    tib_srvr_sn: bodyData.tib_srvr_sn,
    name: bodyData.name,
    selector: bodyData.selector,
  };

  await axios
    .post(queueBrowseUrl, getParamsVal, {
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
}
