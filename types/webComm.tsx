export interface QueueTableData {
  ems_que_nm: string;
  tib_srvr_sn: number;
  grp_nm: string;
  in_byte_rate: number;
  in_msg_rate: number;
  in_tot_byte: number;
  in_tot_msg: number;
  out_byte_rate: number;
  out_msg_rate: number;
  out_tot_byte: number;
  out_tot_msg: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  pend_per_msg_cnt: number;
  pend_per_msg_size: number;
  que_static: boolean;
  raw_queue_sn: number;
  recvr_cnt: number;
  route: boolean;
  route_nm: string;
  rte_cnnt: boolean;
  store_nm: string;
  tib_srvr_alias: string;
}

export interface QueueHistoryTableData {
  clct_dt: string;
  tib_srvr_sn: number;
  ems_que_nm: string;
  in_byte_rate: number;
  in_msg_rate: number;
  in_tot_byte: number;
  in_tot_msg: number;
  out_byte_rate: number;
  out_msg_rate: number;
  out_tot_byte: number;
  out_tot_msg: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  pend_per_msg_cnt: number;
  pend_per_msg_size: number;
  que_static: boolean;
  raw_queue_sn: number;
  recvr_cnt: number;
  route: boolean;
  route_nm: string;
  rte_cnnt: true;
  store_nm: string;
  tib_srvr_alias: string;
}

export interface QueueChartDataList {
  tib_srvr_sn: number;
  clct_dt: string;
  ems_nm: string;
  ems_que_nm: string;
  in_byte_rate: number;
  in_tot_msg: number;
  out_byte_rate: number;
}

export interface TopicHistoryTableData {
  // max_msgs: null;
  // channel: null;
  // is_sender_name_enforced: null;
  // msg_trace: null;
  max_bytes: number;
  // prefetch: null;
  store: number;
  // expiry_override: null;
  // flow_control: null;
  // is_secure: null;
  is_sender_name: string;
  is_global: boolean;
  // is_failsafe: null;
  // overflow_policy: null;
  clct_dt: string;
  tib_srvr_sn: number;
  raw_topic_sn: number;
  tib_srvr_alias: string;
  grp_nm: string;
  ems_tpc_nm: string;
  pend_msg_cnt: number;
  pend_msg_size: number;
  subsb_cnt: number;
  in_tot_msg: number;
  out_tot_msg: number;
  in_byte_rate: number;
  out_byte_rate: number;
  in_tot_byte: number;
  out_tot_byte: number;
  in_msg_rate: number;
  out_msg_rate: number;
  durab_cnt: number;
  avg_msg_size: number;
  tpc_static: boolean;
}

export interface TopicTableData {
  durab_cnt: number;
  tib_srvr_sn: number;
  grp_nm: string;
  ems_tpc_nm: string;
  global: boolean;
  in_byte_rate: number;
  in_msg_rate: number;
  in_tot_byte: number;
  in_tot_msg: number;
  out_byte_rate: number;
  out_msg_rate: number;
  out_tot_byte: number;
  out_tot_msg: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  raw_topic_sn: number;
  store_nm: string;
  subsb_cnt: number;
  tpc_static: boolean;
}

export interface TableHistoryData {
  raw_topic_sn: number;
  tib_srvr_alias: string;
  ems_tpc_nm: string;
  pend_msg_cnt: number;
  pend_msg_size: number;
  subsb_cnt: number;
  in_tot_msg: number;
  out_tot_msg: number;
  in_byte_rate: number;
  out_byte_rate: number;
  in_tot_byte: number;
  out_tot_byte: number;
  in_msg_rate: number;
  out_msg_rate: number;
  durab_cnt: number;
  store_nm: string;
  clct_dt: string;
  global: boolean;
  tpc_static: boolean;
}

export interface ConsumerTableData {
  id: number;
  tib_srvr_alias: string;
  cntn_id: number;
  grp_nm: string;
  dest_nm: string;
  pend_msg_cnt: number;
  pend_msg_size: number;
  byte_rate: number;
  msg_rate: number;
  tot_byte: number;
  tot_msg: number;
  dtl_esin_lst_snt: number;
  dtl_esin_lst_ack_know: number;
  dtl_crmsg_cnt_snd_srvr: number;
  seltr: null;
  user_nm: string;
  sess_id: number;
  dest_tp: string;
  durab_nm: string;
  ack_mode: string;
  mtcast: boolean;
  dtl_atv: boolean;
  dtl_sys: boolean;
}

export interface QueuePatternTableData {
  add_info1: string;
  add_info2: string;
  add_info3: string;
  add_info4: string;
  add_info5: string;
  cd_desc: string;
  cd_grp_id: string;
  cd_id: string;
  cd_nm: string;
  cd_sn: number;
  cd_sqn: number;
  up_grp_id: string;
  updpsb_yn: string;
}

export interface QueuePropertyTableData {
  rawQueueSn: number;
  emsQueNm: string;
  storeNm: string;
  routeNm: string;
  avgMsgSize: number;
  cnsmrCnt: number;
  delivMsgCnt: number;
  expiryOvrd: number;
  flowCtrlMaxByte: number;
  inTotByte: number;
  inByteRate: number;
  inTotMsg: number;
  inMsgRate: number;
  intrsMsgCnt: number;
  maxByte: number;
  maxMsg: number;
  maxRedeve: number;
  msgTrac: number;
  outByteRate: number;
  outMsgRate: number;
  outTotByte: number;
  outTotMsg: number;
  overFlowPolicy: number;
  pendMsgCnt: number;
  pendMsgSize: number;
  pendPerMsgCnt: number;
  pendPerMsgSize: number;
  pendPerstMsgSize: number;
  prerch: number;
  recvrCnt: number;
  redeveDelay: number;
  emsComnDto: {
    clctDt: string;
    tibSrvrSn: number;
    emsNm: number;
  };
  temp: boolean;
  failSafeInhrit: boolean;
  storeInhrit: boolean;
  globalInhrit: boolean;
  global: boolean;
  maxByteInhrit: boolean;
  flowCntlMaxByteInhrit: boolean;
  brigTarInhrit: boolean;
  failSafe: boolean;
  prefchInhrit: boolean;
  redeveDelayInhrit: boolean;
  imptTrspotInhrit: boolean;
  maxMsgInhrit: boolean;
  msgTracInhrit: boolean;
  expiryOvrdInhrit: boolean;
  ovfPolcyInhrit: boolean;
  secureInhrit: boolean;
  sndrNmEnfrInhrit: boolean;
  secure: boolean;
  exclusive: boolean;
  excsvInhrit: boolean;
  rteCnnt: boolean;
  sndrNm: boolean;
  maxRedelvyInhrit: boolean;
  sndRenmEfrce: boolean;
  queStatic: boolean;
  sndrNmInhrit: boolean;
  route: boolean;
}

export interface QueueSearchParams {
  emsSrvrList: string;
  pattern: string;
  name: string;
}

export interface QueueListData {
  in_byte_rate: number;
  in_msg_rate: number;
  in_tot_byte: number;
  in_tot_msg: number;
  out_byte_rate: number;
  out_msg_rate: number;
  out_tot_byte: number;
  out_tot_msg: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  pend_per_msg_cnt: number;
  pend_per_msg_size: number;
  que_static: boolean;
  raw_queue_sn: number;
  recvr_cnt: number;
  route: boolean;
  route_nm: string;
  rte_cnnt: boolean;
  store_nm: string;
}

export interface TopicListData {
  in_byte_rate: number;
  in_msg_rate: number;
  in_tot_byte: number;
  in_tot_msg: number;
  out_byte_rate: number;
  out_msg_rate: number;
  out_tot_byte: number;
  out_tot_msg: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  pend_per_msg_cnt: number;
  pend_per_msg_size: number;
  que_static: boolean;
  raw_queue_sn: number;
  recvr_cnt: number;
  route: boolean;
  route_nm: string;
  rte_cnnt: boolean;
  store_nm: string;
}

export interface QueueChartDataList {
  clct_dt: string;
  ems_nm: string;
  pend_msg_cnt: number;
  pend_msg_size: number;
  in_msg_rate: number;
  in_tot_byte: number;
  out_msg_rate: number;
  out_tot_byte: number;
  tib_srvr_sn: number;
}

export interface QueueBrowserDataList {
  jms_msg_id: string;
  jms_ts: string;
  jms_tp: string;
  msg_size: number;
  jms_dest: string;
  jms_delvy_mode: number;
  jms_delvy_tm: string;
  jms_corr_id: string;
  jms_delvy_cnt: number;
  jms_proty: number;
  body: string;
}

export type AddQueueInputBody = {
  inQueueNm: string;
};

export type AddTopicInputBody = {
  inTopicNm: string;
};

export type AddQTInputBody = {
  inSvcNm: string;
};

export type SrvrListData = {
  inSrvrAlias: string;
  inSrvrDesc: string;
  inSrvrGrpNm: string;
  inTibSrvrSn: number;
};

export interface TestSrvrInputBody {
  srvr_sn: number;
  srvr_alias: string;
  srvr_ht_nm: string;
  srvr_ipaddr: string;
  srvr_port: string;
  srvr_desc: string;
}
export interface SrvrInputBody {
  inSrvrSn?: number;
  inPhySrvrAlias: string;
  inSrvrHtNm: string;
  inSrvrIpaddr: string;
  inSrvrPort: string;
  inSrvrDesc: string;
}

export interface WebUserData {
  user_sn?: number;
  user_id: string;
  user_nm: string;
  user_rol_cd: string;
  pwd_enc?: string;
  user_telno_enc?: string;
  user_eml?: string;
  change_yn?: boolean;
  check_pwd?: string;
  pwd_epi_date?: string;
}

export type PropListData = {
  property: string;
  type: string;
};

export type PermissionData = {
  tib_srvr_sn: number;
  name: string;
  pType: string;
  principal: string;
};

export type QTPropListData = {
  tib_srvr_sn: string;
  grp_nm: string;
  tib_srvr_alias: string;
  ems_qt_nm: string;
  currentVal: string;
  newVal: string;
};
export interface TopicSubscriptionData {
  consumer_count: string;
  create_time: number;
  durable: boolean;
  id: 0;
  name: string;
  pending_msg_count: number;
  pending_msg_size: number;
  selector: string;
  shared: boolean;
  topic_name: string;
}

export interface DurableTableData {
  tib_srvr_sn: number;
  tib_srvr_alias: string;
  grp_nm: string;
  durab_nm: string;
  topic_nm: string;
  clnt_id: string;
  user_nm: string;
  seltr: string;
  cnsmr_id: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  deliv_msg_cnt: string;
  conn: boolean;
  shared: boolean;
  durab_static: boolean;
  atv: boolean;
  no_locl_enbd: boolean;
}

export interface ListTableData {
  name: string;
}

export interface AllServerListData {
  tib_srvr_sn: number;
  alias: string;
  status: true;
  server_name: string;
  fault_tolerant_state: number;
  connections: number;
  sessions: number;
  queues: number;
  topics: number;
  durables: number;
  pending_msgs: number;
  pending_msg_size: number;
  msg_mem: number;
  in_msg_rate: number;
  out_msg_rate: number;
  disk_read_rate: number;
  disk_write_rate: number;
  async_db_size: number;
  sync_db_size: number;
}

export interface StoreTableData {
  grp_nm: string;
  srvr_nm: string;
  raw_store_sn: number;
  clct_dt: string;
  store_nm: string;
  swap_size: number;
  swap_cnt: number;
  used_space: number;
  file_size: number;
  free_space: number;
  msg_size: number;
  dest_defrag: string;
  msg_cnt: number;
  avg_wr_tm: number;
  wr_usge: number;
  store_type: string;
  file_name: string;
  fragmentation: string;
  sync_writes: string;
  write_rate: string;
  sync_progress: string;
  discard_scan_interval: string;
  discard_scan_bytes: string;
  first_scan_finished: string;
}

export interface DurableListData {
  tib_srvr_sn: number;
  tib_srvr_alias: string;
  grp_nm: string;
  durab_nm: string;
  topic_nm: string;
  clnt_id: string;
  user_nm: string;
  seltr: string;
  cnsmr_id: number;
  pend_msg_cnt: number;
  pend_msg_size: number;
  deliv_msg_cnt: number;
  conn: boolean;
  shared: boolean;
  durab_static: boolean;
  atv: boolean;
  no_locl_enbd: boolean;
}

export interface DurableInputBody {
  inSrvrSn: number;
  inSrvrNm: string;
  inDurableNm: string;
  inTopicNm: string;
  inClientID: string;
  inSelector: string;
}

export interface ConnectionListData {
  tib_srvr_sn: number;
  tib_srvr_alias: string;
  ID: number;
  Type: string;
  Host: string;
  Address: string;
  Port: number;
  ClientID: string;
  ConsumerCount: number;
  ProducerCount: number;
  SessionCount: number;
  StartTime: string;
  Uptime: number;
  URL: string;
  UserName: string;
  ClientVersion: string;
  ClientType: string;
  isFT: boolean;
  isXA: boolean;
  isAdmin: boolean;
  UncommittedCount: number;
  UncommittedSize: number;
}

export interface GrpInputBody {
  inGrpNm: string;
  inGrpDesc: string;
}

export interface GrpListData {}

export interface EMSSrvrInputBody {
  inSrvrSn: string;
  inEmsSrvrSn?: number;
  inSrvrGrpCd: string;
  inSrvrNm: string;
  inSrvrUrl: string;
  inSrvrPort: string;
  inUserNm: string;
  inPwd: string;
  inEnIngest: string;
  inEnSys: string;
  inSrvrIpAddr: string;
}

export interface EMSSrvrListData {
  tib_srvr_sn: number;
  tib_srvr_alias: string;
  tib_srvr_desc: string;
  tib_srvr_url: string;
  tib_user_id: string;
  status: string;
  grp_sn: number;
  grp_nm: string;
  tib_srvr_mntr_yn: string;
  tib_srvr_sys_event_yn: string;
}

export interface SrvrPropListData {
  tib_srvr_sn: number;
  tib_srvr_alias: string;
  grp_sn: number;
  grp_nm: string;
  property: string;
}

export interface AddEmsUserInputBody {
  inUserNm: string;
  inPwd: string;
  inDesc: string;
}

export interface ModEmsUserInputBody {
  inSrvrSn: number;
  inSrvrNm: string;
  inUserNm: string;
  inPwd: string;
  inDesc: string;
}

export interface AddEmsGrpInputBody {
  inGrpNm: string;
  inDesc: string;
}

export interface ModEmsGrpInputBody {
  inSrvrSn: number;
  inSrvrNm: string;
  inGrpNm: string;
  inDesc: string;
}
