import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import qs from "qs";
import { MY_INFO } from "../../urlPath";
axios.defaults.paramsSerializer = (params) => {
  return qs.stringify(params, { arrayFormat: "repeat" });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;

  let myIvfoUrl = `${process.env.API_URL}${MY_INFO}`;

  if ("GET".match(caseType)) {
    const getParamsVal = {
      user_sn: bodyData.user_sn,
    };

    await axios
      .get(myIvfoUrl, {
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
        // if (error) {
        //   res.status(error.response.status).json(error.response.data);
        // }
      });
  }
}
