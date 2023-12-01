import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { parseCookies } from "nookies";

function LoginWrapper({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  const cookies = parseCookies();
  const accessToken = cookies["access_token"];

  // accessToken 존재 여부
  const isLogin = !!accessToken;

  useEffect(() => {
    if (!isLogin) {
      router.push("/login");
    }
  }, []);

  return <>{children}</>;
}

export default LoginWrapper;
