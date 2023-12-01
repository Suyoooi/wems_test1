import { ColumnDefinition } from "tabulator-tables";

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

export const TOPIC_DATE_COLUMNS_LIST = [
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
    width: 100,
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
    title: "TopicName",
    field: "ems_tpc_nm",
    headerTooltip: true,
    width: 150,
    hozAlign: "left",
  },
  // {
  //   title: "SubscriberCount",
  //   field: "subsb_cnt",
  //   hozAlign: "right",
  //   headerTooltip: true,
  //   width: 150,
  // },
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
    width: 160,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "Static",
    field: "is_tpc_static",
    align: "center",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "DurableCount",
    field: "durab_cnt",
    hozAlign: "right",
    headerTooltip: true,
    width: 130,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "StoreName",
    field: "store",
    hozAlign: "left",
    headerTooltip: true,
    width: 130,
  },

  {
    title: "global",
    field: "is_global",
    hozAlign: "left",
    headerTooltip: true,
    width: 130,
  },
];

export const TOPIC_PROPERTY_HEADER_LIST: ColumnDefinition[] = [
  // {
  //   title: "No",
  //   field: "dataNo",
  //   headerTooltip: true,
  //   width: 70,
  //   formatter: "rownum",
  //   hozAlign: "center",
  //   headerSort: false,
  // },
  {
    title: "Topic Property",
    headerTooltip: true,
    hozAlign: "left",
    width: 215,
    field: "key",
  },
  {
    title: "Value",
    headerTooltip: true,
    hozAlign: "left",
    width: 180,
    field: "value",
  },
];

export const TOPIC_SUBSCRIPTION_LIST: ColumnDefinition[] = [
  {
    title: "No",
    field: "dataNo",
    headerTooltip: true,
    width: 70,
    frozen: true,
    hozAlign: "center",
    formatter: "rownum",
    headerSort: false,
  },
  {
    title: "ID",
    field: "id",
    hozAlign: "right",
    headerTooltip: true,
    width: 100,
    frozen: true,
  },
  {
    title: "ServerName",
    field: "server_alias",
    frozen: true,
    hozAlign: "left",
    headerTooltip: true,
    width: 150,
  },
  {
    title: "Group",
    field: "grp_nm",
    headerTooltip: true,
    hozAlign: "left",
    width: 130,
  },
  {
    title: "CreateTime",
    field: "create_time",
    hozAlign: "left",
    headerTooltip: true,
    width: 155,
  },
  {
    title: "Name",
    field: "name",
    headerTooltip: true,
    hozAlign: "left",
    width: 150,
  },
  {
    title: "TopicName",
    field: "topic_name",
    hozAlign: "left",
    headerTooltip: true,
    width: 150,
  },
  // {
  //   title: "SubscriberCount",
  //   field: "subsb_cnt",
  //   hozAlign: "right",
  //   headerTooltip: true,
  //   width: 160,
  // },
  {
    title: "PendingMsgCount",
    field: "pending_msg_count",
    hozAlign: "right",
    headerTooltip: true,
    width: 160,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "PendingMsgSize",
    field: "pending_msg_size",
    hozAlign: "right",
    headerTooltip: true,
    width: 160,
    formatter: function (cell: any) {
      return FormatBytes(cell.getValue());
    },
  },
  {
    title: "ConsumerCount",
    field: "consumer_count",
    hozAlign: "right",
    headerTooltip: true,
    width: 160,
    formatter: function (cell: any) {
      return setCommaNum(cell, cell.getValue());
    },
  },
  {
    title: "Selector",
    field: "selector",
    hozAlign: "left",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "isDurable",
    field: "is_durable",
    hozAlign: "center",
    headerTooltip: true,
    width: 120,
  },
  {
    title: "isShared",
    field: "is_shared",
    hozAlign: "center",
    headerTooltip: true,
    width: 100,
  },
];
