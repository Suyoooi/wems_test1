// 브라우저를 닫았을 때 로그아웃 처리
// const decodedToken: any = jwt.decode(accessToken, { complete: true });
// if (decodedToken && decodedToken.payload.exp) {
//   const currentTime = Math.floor(new Date().getTime() / 1000);
//   const expirationTimestamp = decodedToken.payload.exp;

//   if (currentTime > expirationTimestamp) {
//     // 만료시간이 지난 경우 로그아웃 처리
//     console.log(
//       "장시간 움직임이 없어 로그아웃 되었습니다.\n다시 로그인해주시기 바랍니다"
//     );
//     console.log("여기가 문제 있는 부분임");
//     logout();
//   }

//   console.log("현재시간:", currentTime);
//   console.log("만료시간:", expirationTimestamp);
// }

// const cookies = parseCookies();
// const accessToken = cookies["access_token"];
// const decodedToken: any = jwt.decode(accessToken, { complete: true });
// if (decodedToken && decodedToken.payload.exp) {
//   // 밀리 초를 초 단위로 변환
//   const currentTimestamp = Math.floor(Date.now() / 1000);
//   // 토큰 만료시간
//   const expirationTimestamp = decodedToken.payload.exp;
//   // 토큰이 만료될 때까지 남은 시간
//   const remainingTimeInSeconds = expirationTimestamp - currentTimestamp;

//   const expirationDate = new Date(expirationTimestamp * 1000);

//   console.log(":::토큰 만료시간:::", expirationDate);

//   // 남은 시간을 시간, 분, 초로 분해
//   const hours = Math.floor(remainingTimeInSeconds / 3600);
//   const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
//   const seconds = remainingTimeInSeconds % 60;

//   console.log(
//     `현재 시간과 토큰 만료 시간의 차이: ${hours}시간 ${minutes}분 ${seconds}초`
//   );

//   console.log("현재시간:", currentTimestamp);
//   console.log("토큰 만료시간:", expirationTimestamp);
//   console.log("토큰이 만료될 때까지 남은 시간:", remainingTimeInSeconds);
// }
