
export default function CsvFileNm(fileName: any, fileType: any) {
  function padTo2Digits(num: any) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date: Date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds())
      ].join('')
    );
  }

  let todayInfo = formatDate(new Date());

  const fileNm = fileName.replace(/\s/g, "_");
  const fullFileNm = fileNm.concat("_").concat(todayInfo).concat(".").concat(fileType);
  return fullFileNm;
}