import { ColumnDefinition } from "tabulator-tables";

export const ALL_SERVER_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerAlias",
    field: "alias",
  },
  {
    title: "State",
    field: "status",
  },
  {
    title: "ServerName",
    field: "server_name",
  },
  {
    title: "FaultTolerantState",
    field: "fault_tolerant_state",
  },

  {
    title: "Connections",
    field: "connections",
  },
  {
    title: "Sessions",
    field: "sessions",
  },
  {
    title: "Queues",
    field: "queues",
  },
  {
    title: "Topics",
    field: "topics",
  },
  {
    title: "Durables",
    field: "durables",
  },
  {
    title: "PendingMsgs",
    field: "pending_msgs",
  },
  {
    title: "PendingMsgSize",
    field: "pending_msg_size",
  },
  {
    title: "MsgMem",
    field: "msg_mem",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "DiskReadRate",
    field: "disk_read_rate",
  },
  {
    title: "DiskWriteRate",
    field: "disk_write_rate",
  },
  {
    title: "AsyncDBSize",
    field: "async_db_size",
  },
  {
    title: "SyncDBSize",
    field: "sync_db_size",
  },
  {
    title: "RespTime",
    field: "sync_db_size",
  },
];

export const QUEUE_DATE_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },

  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "QueueName",
    field: "ems_que_nm",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ReceiverCount",
    field: "recvr_cnt",
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "PendPersMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendPersMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
  },
  {
    title: "StoreName",
    field: "store_nm",
  },
  {
    title: "Static",
    field: "is_que_static",
  },
  {
    title: "Routed",
    field: "is_route",
  },
  {
    title: "RouteConnected",
    field: "is_rte_cnnt",
  },
  {
    title: "RouteName",
    field: "route_nm",
  },
];

export const QUEUE_BROWSE_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "MessageID",
    field: "jms_msg_id",
  },
  {
    title: "Timestamp",
    field: "jms_ts",
  },
  {
    title: "Type",
    field: "jms_tp",
  },
  {
    title: "MsgSize",
    field: "msg_size",
  },
  {
    title: "Destination",
    field: "jms_dest",
  },
  {
    title: "DeliveryMode",
    field: "jms_delvy_mode",
  },
  {
    title: "DeliveryTime",
    field: "jms_delvy_tm",
  },
  {
    title: "CorrelationID",
    field: "jms_corr_id",
  },
];

export const CONSUMER_DATA_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },

  {
    title: "CreateTime",
    field: "cre_tm",
  },
  {
    title: "DestinationName",
    field: "dest_nm",
  },
  {
    title: "Active",
    field: "dtl_atv",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ByRate",
    field: "byte_rate",
  },
  {
    title: "MsgRate",
    field: "msg_rate",
  },
  {
    title: "TotalByte",
    field: "tot_byte",
  },
  {
    title: "TotalMsgs",
    field: "tot_msg",
  },
  {
    title: "MillisSinceLastSent",
    field: "dtl_esin_lst_snt",
  },
  {
    title: "MillisSinceLastAck",
    field: "dtl_esin_lst_ack_know",
  },
  {
    title: "UnackedMsgCount",
    field: "dtl_crmsg_cnt_snd_srvr",
  },
  {
    title: "Selector",
    field: "seltr",
  },
  {
    title: "UserName",
    field: "user_nm",
  },
  {
    title: "ConnectedID",
    field: "cntn_id",
  },
  {
    title: "SessionID",
    field: "sess_id",
  },
  {
    title: "System",
    field: "dtl_sys",
  },
  {
    title: "AckMode",
    field: "ack_mode",
  },
  {
    title: "DestinationType",
    field: "dest_tp",
  },
  {
    title: "DurableName",
    field: "durab_nm",
  },
  {
    title: "Multicast",
    field: "mtcast",
  },
];

export const DURABLE_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },

  {
    title: "DurableName",
    field: "durab_nm",
  },
  {
    title: "TopicName",
    field: "topic_nm",
  },
  {
    title: "Active",
    field: "atv",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ClientID",
    field: "clnt_id",
  },
  {
    title: "ConsumerID",
    field: "cnsmr_id",
  },
  {
    title: "UserName",
    field: "user_nm",
  },
  {
    title: "Selector",
    field: "seltr",
  },
  {
    title: "NoLocal",
    field: "no_locl_enbd",
  },
  {
    title: "DeliveredMsgCount",
    field: "deliv_msg_cnt",
  },
  {
    title: "Static",
    field: "durab_static",
  },
  {
    title: "isShared",
    field: "shared",
  },
];

export const PRODUCER_DATA_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "connectionID",
    field: "cntn_id",
  },
  {
    title: "CreateTime",
    field: "cre_tm",
  },
  {
    title: "DestinationName",
    field: "dest_nm",
  },
  {
    title: "DestinationType",
    field: "dest_tp",
  },
  {
    title: "ConnectedID",
    field: "cntn_id",
  },
  {
    title: "SessionID",
    field: "sess_id",
  },
  {
    title: "Username",
    field: "user_nm",
  },
  {
    title: "ByteRate",
    field: "byte_rate",
  },
  {
    title: "MsgRate",
    field: "msg_rate",
  },
  {
    title: "TotalBytes",
    field: "tot_byte",
  },
  {
    title: "TotalMsgs",
    field: "tot_msg",
  },
];

export const STORE_COLUMNS_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "CollectionDate",
    field: "clct_dt",
  },
  {
    title: "StoreName",
    field: "store_nm",
  },
  {
    title: "StoreType",
    field: "store_type",
  },
  {
    title: "FileName",
    field: "file_name",
  },
  {
    title: "FileSize",
    field: "file_size",
  },
  {
    title: "FreeSpace",
    field: "free_space",
  },
  {
    title: "UsedSpace",
    field: "used_space",
  },
  {
    title: "Fragmentation",
    field: "fragmentation",
  },
  {
    title: "MsgSize",
    field: "msg_size",
  },
  {
    title: "MSgCount",
    field: "msg_cnt",
  },
  {
    title: "SyncWrites",
    field: "sync_writes",
  },
  {
    title: "SwappedSize",
    field: "swap_size",
  },
  {
    title: "WriteRate",
    field: "write_rate",
  },
  {
    title: "AvgWriteTime(ms)",
    field: "avg_wr_tm",
  },
  {
    title: "WriteUsage",
    field: "wr_usge",
  },
  {
    title: "DestDefrag",
    field: "dest_defrag",
  },
  {
    title: "SyncProgress",
    field: "sync_progress",
  },
  {
    title: "DiscardScanInterval",
    field: "discard_scan_interval",
  },
  {
    title: "DiscardScanBytes",
    field: "discard_scan_bytes",
  },
  {
    title: "FirstScanFinished",
    field: "first_scan_finished",
  },
];

export const TOPIC_SUBSCRIPTION_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ID",
    field: "id",
  },
  {
    title: "ServerName",
    field: "server_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "CreateTime",
    field: "create_time",
  },
  {
    title: "Name",
    field: "name",
  },
  {
    title: "TopicName",
    field: "topic_name",
  },
  {
    title: "PendingMsgCount",
    field: "pending_msg_count",
  },
  {
    title: "PendingMsgSize",
    field: "pending_msg_size",
  },
  {
    title: "ConsumerCount",
    field: "consumer_count",
  },
  {
    title: "Selector",
    field: "selector",
  },
  {
    title: "isDurable",
    field: "is_durable",
  },
  {
    title: "isShared",
    field: "is_shared",
  },
];

export const BRIDGES_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "server_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "Source",
    field: "source",
  },
  {
    title: "SourceType",
    field: "source_type",
  },
  {
    title: "Target",
    field: "target",
  },
  {
    title: "TargetType",
    field: "target_type",
  },
  {
    title: "Selector",
    field: "selector",
  },
];

export const DURABLE_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "DurableName",
    field: "durab_nm",
  },
  {
    title: "TopicName",
    field: "topic_nm",
  },
  {
    title: "Active",
    field: "atv",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ClientID",
    field: "clnt_id",
  },
  {
    title: "ConsumerID",
    field: "cnsmr_id",
  },
  {
    title: "UserName",
    field: "user_nm",
  },
  {
    title: "Selector",
    field: "seltr",
  },
  {
    title: "NoLocal",
    field: "no_locl_enbd",
  },
  {
    title: "DeliveredMsgCount",
    field: "deliv_msg_cnt",
  },
  {
    title: "Static",
    field: "durab_static",
  },
  {
    title: "isShared",
    field: "shared",
  },
];

export const QUEUE_COLUMNS: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "QueueName",
    field: "ems_que_nm",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "CollectionDateTime",
    field: "clct_dt",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ReceiverCount",
    field: "recvr_cnt",
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "PendPersMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendPersMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
  },
  {
    title: "StoreName",
    field: "store",
  },
  {
    title: "Static",
    field: "is_que_static",
  },
  {
    title: "Routed",
    field: "is_route",
  },
  {
    title: "RouteConnected",
    field: "is_rte_cnnt",
  },
  {
    title: "RouteName",
    field: "route_nm",
  },
];

export const TOPIC_COLUMNS: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "TopicName",
    field: "ems_tpc_nm",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "Date",
    field: "clct_dt",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "SubscriberCount",
    field: "subsb_cnt",
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
  },
  {
    title: "DurableCount",
    field: "durab_cnt",
  },
  {
    title: "Static",
    field: "is_tpc_static",
  },
  {
    title: "StoreName",
    field: "store",
  },
  {
    title: "Global",
    field: "global",
  },
];

export const EMS_SERVER_COLUMNS: ColumnDefinition[] = [
  {
    title: "ServerSn",
    field: "tib_srvr_sn",
  },
  {
    title: "Server Alias",
    field: "alias",
  },
  {
    title: "Status",
    field: "status",
  },
  {
    title: "ServerName",
    field: "server_name",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "FaultTolerantState",
    field: "fault_tolerant_state",
  },
  {
    title: "Events",
    field: "",
  },
  {
    title: "Connections",
    field: "connections",
  },
  {
    title: "Sessions",
    field: "sessions",
  },
  {
    title: "Queues",
    field: "queues",
  },
  {
    title: "Topics",
    field: "topics",
  },
  {
    title: "Durables",
    field: "durables",
  },
  {
    title: "PendingMsgs",
    field: "pending_msgs",
  },
  {
    title: "PendingMsgSize",
    field: "pending_msg_size",
  },
  {
    title: "MsgMem",
    field: "msg_mem",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "DiskReadRate",
    field: "disk_read_rate",
  },
  {
    title: "DiskWriteRate",
    field: "disk_write_rate",
  },
  {
    title: "AsyncDBSize",
    field: "async_db_size",
  },
  {
    title: "SyncDBSize",
    field: "sync_db_size",
  },
  {
    title: "RespTime",
    field: "",
  },
];

export const USER_COLUMNS: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "ems_alias",
  },
  {
    title: "UserName",
    field: "user_name",
  },
  {
    title: "Description",
    field: "description",
  },
  {
    title: "isExternal",
    field: "is_external",
  },
  {
    title: "Principal Type",
    field: "principal_type",
  },
  {
    title: "Permissions",
    field: "permissions",
  },
];

export const SET_GRP_INFO_COLUMNS: ColumnDefinition[] = [
  {
    title: "Serial Number",
    field: "grp_sn",
  },
  {
    title: "Group Name",
    field: "grp_nm",
  },
  {
    title: "Group Desc",
    field: "grp_desc",
  },
  {
    title: "Server Number",
    field: "count",
  },
];

export const CONNECTION_COLUMNS: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "ID",
    field: "ID",
  },
  {
    title: "Type",
    field: "Type",
  },
  {
    title: "Host",
    field: "Host",
  },
  {
    title: "Address",
    field: "Address",
  },
  {
    title: "Port",
    field: "Port",
  },
  {
    title: "ClientID",
    field: "ClientID",
  },
  {
    title: "ConsumerCount",
    field: "ConsumerCount",
  },
  {
    title: "ProducerCount",
    field: "ProducerCount",
  },
  {
    title: "SessionCount",
    field: "SessionCount",
  },
  {
    title: "StartTime",
    field: "StartTime",
  },
  {
    title: "Uptime",
    field: "Uptime",
  },
  {
    title: "URL",
    field: "URL",
  },
  {
    title: "UserName",
    field: "UserName",
  },
  {
    title: "ClientVersion",
    field: "ClientVersion",
  },
  {
    title: "ClientType",
    field: "ClientType",
  },
  {
    title: "isFT",
    field: "isFT",
  },
  {
    title: "isXA",
    field: "isXA",
  },
  {
    title: "isAdmin",
    field: "isAdmin",
  },
  {
    title: "UncommittedCount",
    field: "UncommittedCount",
  },
  {
    title: "UncommittedSize",
    field: "UncommittedSize",
  },
];

export const QUEUE_HIST_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "Date",
    field: "clct_dt",
  },
  {
    title: "QueueName",
    field: "ems_que_nm",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "ReceiverCount",
    field: "recvr_cnt",
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "PendPersMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendPersMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
  },
  {
    title: "StoreName",
    field: "store",
  },
  {
    title: "Static",
    field: "is_que_static",
  },
  {
    title: "Routed",
    field: "is_route",
  },
  {
    title: "RouteConnected",
    field: "is_rte_cnnt",
  },
  {
    title: "RouteName",
    field: "route_nm",
  },
];

export const TOPIC_HIST_LIST_EXCEL: ColumnDefinition[] = [
  {
    title: "ServerName",
    field: "tib_srvr_alias",
  },
  {
    title: "Group",
    field: "grp_nm",
  },
  {
    title: "Date",
    field: "clct_dt",
  },
  {
    title: "TopicName",
    field: "ems_tpc_nm",
  },
  {
    title: "PendingMsgCount",
    field: "pend_msg_cnt",
  },
  {
    title: "PendingMsgSize",
    field: "pend_msg_size",
  },
  {
    title: "InTotalMsgs",
    field: "in_tot_msg",
  },
  {
    title: "OutTotalMsgs",
    field: "out_tot_msg",
  },
  {
    title: "InMsgRate",
    field: "in_msg_rate",
  },
  {
    title: "OutMsgRate",
    field: "out_msg_rate",
  },
  {
    title: "InTotalBytes",
    field: "in_tot_byte",
  },
  {
    title: "OutTotalBytes",
    field: "out_tot_byte",
  },
  {
    title: "InByteRate",
    field: "in_byte_rate",
  },
  {
    title: "OutByteRate",
    field: "out_byte_rate",
  },
  {
    title: "AvgMsgSize",
    field: "avg_msg_size",
  },
  {
    title: "Static",
    field: "is_tpc_static",
  },
  {
    title: "DurableCount",
    field: "durab_cnt",
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
  },
];
