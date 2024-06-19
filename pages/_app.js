import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import AuthMiddleware from "@/middleware/auth";

export default function App({ Component, pageProps }) {
  return (
    <AuthMiddleware>
      <NextUIProvider>
        <Component {...pageProps} />
      </NextUIProvider>
    </AuthMiddleware>
  );
}
