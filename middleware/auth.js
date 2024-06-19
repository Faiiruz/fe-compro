import { useEffect } from "react";
import { useRouter } from "next/router";

const AuthMiddleware = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (!isAuthenticated) {
      router.push("/login");
    }
  }, []);

  return children;
};

export default AuthMiddleware;
