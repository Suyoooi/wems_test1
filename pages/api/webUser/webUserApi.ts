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

  let webUserUrl = `${process.env.API_URL}/tibco/ems/web/user`;

  const headerInfo = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    Accept: "application/json",
  };

  if ("POST".match(caseType)) {
    const postParamsVal = {
      pwd_enc: bodyData.pwd_enc,
      user_eml: bodyData.user_eml,
      user_id: bodyData.user_id,
      user_nm: bodyData.user_nm,
      user_rol_cd: bodyData.user_rol_cd,
      user_telno_enc: bodyData.user_telno_enc,
    };

    await axios
      .post(webUserUrl, postParamsVal, {
        headers: {
          ...headerInfo,
          // , Authorization: `Bearer ${accessToken}`
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
  } else if ("PATCH".match(caseType)) {
    const putParamsVal = {
      user_sn: bodyData.user_sn,
      pwd_enc: bodyData.pwd_enc,
      user_eml: bodyData.user_eml,
      user_id: bodyData.user_id,
      user_nm: bodyData.user_nm,
      user_rol_cd: bodyData.user_rol_cd,
      user_telno_enc: bodyData.user_telno_enc,
      change_yn: bodyData.change_yn,
    };

    const accessToken = bodyData.access_token;

    const putUrl = webUserUrl.concat("/").concat(bodyData.user_sn);

    await axios
      .patch(putUrl, putParamsVal, {
        headers: {
          ...headerInfo,
          // , Authorization: `Bearer ${accessToken}`
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
  } else if ("DEL".match(caseType)) {
    const accessToken = bodyData.access_token;
    const delUrl = webUserUrl.concat("/").concat(bodyData.user_sn);

    axios
      .delete(delUrl, {
        headers: {
          ...headerInfo,
          // , Authorization: `Bearer ${accessToken}`
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
  } else if ("R_POST".match(caseType)) {
    const resetUrl = webUserUrl
      .concat("/")
      .concat(bodyData.user_sn)
      .concat("/reset/lgn");

    const postParamsVal = {
      user_sn: bodyData.user_sn,
    };

    await axios
      .post(resetUrl, postParamsVal, {
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
  } else if ("P_POST".match(caseType)) {
    const epiUrl = webUserUrl
      .concat("/")
      .concat(bodyData.user_sn)
      .concat("/epi");

    const postParamsVal = {
      user_sn: bodyData.user_sn,
    };

    await axios
      .post(epiUrl, postParamsVal, {
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
  } else if ("C_POST".match(caseType)) {
    const checkUrl = webUserUrl
      .concat("/")
      .concat(bodyData.user_sn)
      .concat("/password");

    const postParamsVal = {
      user_sn: bodyData.user_sn,
      check_pwd: bodyData.check_pwd,
    };

    await axios
      .post(checkUrl, postParamsVal, {
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
  } else if ("L_POST".match(caseType)) {
    const checkUrl = webUserUrl
      .concat("/")
      .concat(bodyData.user_sn)
      .concat("/reset-password");

    await axios
      .post(
        checkUrl,
        {},
        {
          headers: headerInfo,
        }
      )
      .then(async function (response) {
        res.status(200).json(response.data);
      })
      .catch(function (error) {
        console.log(error);
        if (error) {
          res.status(error.response.status).json(error.response.data);
        }
      });
  } else if ("GET".match(caseType)) {
    const getParamsVal = {
      user_id: bodyData.user_id,
      user_nm: bodyData.user_nm,
      user_rol_cd: bodyData.user_rol_cd,
    };

    await axios
      .get(webUserUrl, {
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
