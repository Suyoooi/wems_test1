import { ColumnDefinition } from "react-tabulator";

const setCommaNum = (cell: any, num: any) => {
  if (num && num >= -1) {
    const numVal = num.toLocaleString("ko-KR");
    return numVal;
  } else {
    return 0;
  }
};

function FormatBytes(bytes: any, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  const parseData = parseFloat(
    (bytes / Math.pow(k, i)).toFixed(dm >= 0 && dm <= 20 ? dm : 2)
  );
  const parseVal = parseData.toLocaleString("ko-KR") + " " + sizes[i];

  return parseVal;
}

export const QUEUE_DATE_COLUMNS_LIST: ColumnDefinition[] = [
  {
    title: "No",
    field: "dataNo",
    frozen: true,
    formatter: "rownum",
    headerTooltip: true,
    hozAlign: "center",
    width: 70,
    headerSort: false,
  },
  {
    title: "ServerName",
    field: "tib_srvr_alias",
    frozen: true,
    headerTooltip: true,
    hozAlign: "left",
    width: 130,
  },
  {
    title: "Group",
    field: "grp_nm",
    frozen: true,
    headerTooltip: true,
    hozAlign: "left",
    width: 130,
  },
  {
    title: "Date",
    field: "clct_dt",
    frozen: true,
    headerTooltip: true,
    hozAlign: "center",
    width: 180,
  },
  {
    title: "QueueName",
    field: "ems_que_nm",
    headerTooltip: true,
    width: 130,
    hozAlign: "left",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
    headerTooltip: true,
    hozAlign: "right",
    width: 160,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
    headerTooltip: true,
    hozAlign: "right",
    width: 150,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "ReceiverCount",
    field: "recvr_cnt",
    headerTooltip: true,
    hozAlign: "right",
    width: 150,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
    headerTooltip: true,
    width: 130,
    hozAlign: "right",
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "PendPersMsgCount",
    field: "pend_msg_cnt",
    headerTooltip: true,
    hozAlign: "right",
    width: 180,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "PendPersMsgSize",
    field: "pend_msg_size",
    headerTooltip: true,
    hozAlign: "right",
    width: 165,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
    headerTooltip: true,
    hozAlign: "right",
    width: 130,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "StoreName",
    field: "store",
    headerTooltip: true,
    width: 130,
    hozAlign: "left",
  },
  {
    title: "Static",
    field: "is_que_static",
    headerTooltip: true,
    width: 100,
    hozAlign: "center",
  },
  {
    title: "Routed",
    field: "is_route",
    headerTooltip: true,
    width: 100,
    hozAlign: "center",
  },
  {
    title: "RouteConnected",
    field: "is_rte_cnnt",
    headerTooltip: true,
    width: 150,
    hozAlign: "center",
  },
  {
    title: "RouteName",
    field: "route_nm",
    headerTooltip: true,
    width: 130,
    hozAlign: "left",
  },
];

export const QUEUE_PROPERTY_HEADER_LIST: ColumnDefinition[] = [
  {
    title: "Queue Property",
    headerTooltip: true,
    width: 200,
    field: "key",
    hozAlign: "left",
  },
  {
    title: "Value",
    headerTooltip: true,
    width: 150,
    field: "value",
    hozAlign: "left",
  },
];

export const QUEUE_BROWSER_HEADER_DATA_LIST: ColumnDefinition[] = [
  {
    title: "Property",
    field: "key",
    hozAlign: "left",
    headerTooltip: true,
    width: 200,
  },
  {
    title: "Value",
    field: "value",
    hozAlign: "left",
    headerTooltip: true,
  },
];

export const QUEUE_BROWSER_BODY_DATA_LIST: ColumnDefinition[] = [
  {
    title: "Property",
    headerTooltip: true,
    field: "mapValue.key",
    hozAlign: "left",
    width: 200,
  },
  {
    title: "mapValue",
    field: "mapValue.value",
    headerTooltip: true,
    width: 200,
    hozAlign: "left",
  },
];
