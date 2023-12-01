import useMultilingual, { LanguageType } from "@/hook/useMultilingual";
import { useSelector } from "react-redux";

// 언어 선택
const lang = useSelector(
  (state: { lang: { lang: LanguageType } }) => state.lang.lang
);
const t = useMultilingual(lang);

export const ALL_SERVER_HIST_LIST = [
  {
    title: "No",
    field: "dataNo",
    frozen: true,
    formatter: "rownum",
    headerTooltip: true,
    width: 70,
    headerSort: false,
  },
  {
    title: t("MUL_WD_0069"),
    field: "alias",
    frozen: true,
    headerTooltip: true,
    width: 130,
  },
  {
    title: "State",
    field: "state",
    frozen: true,
    headerTooltip: true,
    width: 100,
  },
  {
    title: "ServerName",
    field: "server_name",
    frozen: true,
    headerTooltip: true,
    width: 130,
  },
  {
    title: "FaultTolerantState",
    field: "fault_tolerant_state",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "Events",
    field: "event",
    headerTooltip: true,
    width: 100,
  },

  {
    title: "Connections",
    field: "connections",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "Sessions",
    field: "sessions",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "Queues",
    field: "queues",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "Topics",
    field: "topics",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "Durables",
    field: "durables",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "PendingMsgs",
    field: "pending_msgs",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "PendingMsgSize",
    field: "pending_msg_size",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "MsgMem",
    field: "msg_mem",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "DiskReadRate",
    field: "disk_read_rate",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "DiskWriteRate",
    field: "disk_write_rate",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "AsyncDBSize",
    field: "async_db_size",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "SyncDBSize",
    field: "sync_db_size",
    headerTooltip: true,
    width: 100,
  },
  {
    title: "RespTime",
    field: "sync_db_size",
    headerTooltip: true,
    width: 100,
  },
];
