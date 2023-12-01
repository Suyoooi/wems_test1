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
  const bodyData = req.body;

  const caseType = bodyData.case_method;

  let url = `${process.env.API_URL}/reissue`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  };

  if ("POST".match(caseType)) {
    const accessToken = bodyData.access_token;
    const refreshToken = bodyData.refresh_token;

    await axios
      .post(
        url,
        {},
        {
          headers: {
            ...headerInfo,
            // Authorization: `Bearer ${accessToken}`,
            Cookie: `refresh_token=${refreshToken}`,
          },
        }
      )
      .then(async function (response) {
        const setCookieHeaderValue = response.headers["set-cookie"];
        const setAuthorizationHeaderValue = response.headers["authorization"];

        // 'Bearer'를 제외한 나머지값 추출
        const accessTokenValue = setAuthorizationHeaderValue.split(" ").pop();

        // 'Set-Cookie'에서 쿠키 값을 추출
        const cookieValueArray =
          setCookieHeaderValue && setCookieHeaderValue[0]
            ? setCookieHeaderValue[0].split(";")
            : [];
        const refreshTokenValue =
          cookieValueArray.length > 0
            ? cookieValueArray[0].split("=")[1]
            : "error";

        res.status(200).json({ accessTokenValue, refreshTokenValue });
      })
      .catch(function (error) {
        res.status(401).json({ error: "리프레시 토큰이 발급되지 않았습니다." });
      });
  }
}
