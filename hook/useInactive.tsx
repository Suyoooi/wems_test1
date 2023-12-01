import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";

const useInactive = (onInactive: () => void, onActive: () => void) => {
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];
  const [lastActivityTime, setLastActivityTime] = useState(Date.now());
  const decodedToken: any = jwt.decode(accessToken, { complete: true });

  useEffect(() => {
    // 만료 시간 정보 가져오기
    if (decodedToken && decodedToken.payload.exp) {
      // 현재 시간
      const currentTime = Date.now();
      // 밀리 초를 초 단위로 변환
      const currentTimestamp = Math.floor(Date.now() / 1000);
      // 토큰 만료시간
      const expirationTimestamp = decodedToken.payload.exp;
      // 토큰이 만료될 때까지 남은 시간
      const remainingTimeInSeconds = expirationTimestamp - currentTimestamp;
      // 비활동 시간
      const inactiveDurationInSeconds =
        currentTimestamp - lastActivityTime / 1000;

      const expirationDate = new Date(expirationTimestamp * 1000);

      const activityTimer = setInterval(() => {
        // 비활동 시간이 토큰 만료시간보다 짧을 때 (만료기간 내에 활동이 있을 경우)
        if (inactiveDurationInSeconds <= remainingTimeInSeconds) {
          onActive();
        } else {
          onInactive();
        }
      }, 1000);

      return () => {
        clearInterval(activityTimer);
      };
    }
  }, [onInactive, onActive, lastActivityTime]);

  const updateUserActivity = () => {
    setLastActivityTime(Date.now());
  };

  return { updateUserActivity };
};

export default useInactive;
