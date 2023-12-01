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

module.exports = FormatBytes;
