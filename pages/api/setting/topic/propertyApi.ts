import type { NextApiRequest, NextApiResponse } from 'next'
import axios, {AxiosRequestConfig, AxiosRequestHeaders} from "axios";
import { useCallback, useEffect, useState } from "react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const bodyData = JSON.parse(req.body);
  const caseType = bodyData.case_method;
  const accessToken = bodyData.accToken;

  let propListUrl = `${process.env.API_URL}/monitor/topic/property/`;
  let propModUrl = `${process.env.API_URL}/tibco/ems/topic/property`;
  let listPropModUrl = `${process.env.API_URL}/tibco/ems/topic/list/property`;

  const headerInfo = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Authorization': `Bearer ${accessToken}`
  };

  if ("ALL_GET".match(caseType)) {
    const propUrl = propListUrl.concat(bodyData.rawTopicSn);

    await axios.get(propUrl, {
      headers: headerInfo
    })
    .then(function(response) {
      res.status(200).json(response.data)
    })
    .catch(function(error) {
      console.log(error);
      if (error) {
        res.status(error.response.status).json(error.response.data);
      }
    });
  } else if ("PROP_GET".match(caseType)) {
    const getParamsVal = {
      raw_topic_sn: bodyData.raw_topic_sn
    };

    await axios.get(propModUrl, {
      params: getParamsVal,
      headers: headerInfo
    })
    .then(function(response) {
      res.status(200).json(response.data)
    })
    .catch(function(error) {
      console.log(error);
      if (error) {
        res.status(error.response.status).json(error.response.data);
      }
    });
  } else if ("POST".match(caseType)) {
    const postParamsVal = {
      srvr_sn: bodyData.srvr_sn,
      topic_name: bodyData.topic_name,
      topic_prop_value_list: bodyData.topic_prop_value_list
    };

    await axios.post(propModUrl, postParamsVal, {
      headers: headerInfo
    })
    .then(async function(response) {
      res.status(200).json(response.data)
    })
    .catch(function(error) {
      console.log(error);
      if (error) {
        res.status(error.response.status).json(error.response.data);
      }
    });
  } else if ("PUT".match(caseType)) {
    const putParamsVal = {
      property: bodyData.property,
      srvr_info_list: bodyData.set_prop_list
    };
  
    await axios.put(listPropModUrl, putParamsVal, {
      headers: headerInfo
    })
    .then(async function(response) {
      res.status(200).json(response.data)
    })
    .catch(function(error) {
      console.log(error);
      if (error) {
        res.status(error.response.status).json(error.response.data);
      }
    });
  }
}
