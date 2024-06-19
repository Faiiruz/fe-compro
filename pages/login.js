import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Spinner,
} from "@nextui-org/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (isAuthenticated) {
      router.push("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return toast.warn("Please fill in username and password", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3011/api/users/login",
        {
          username,
          password,
        }
      );

      if (response.status === 200) {
        const data = response.data.data;
        const token = data.token;
        localStorage.setItem("token", token);
        toast.success("Success Login", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        router.push("/");
      } else {
        return toast.info(`Invaliad Username or Password`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      return toast.warn(`Internal Server Error`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center h-screen">
        <Card className="w-96">
          <CardHeader className="flex flex-col items-center justify-center space-y-5">
            <Image src="/image/amital2.png" width={150} height={150} />
            <h1>Welcome</h1>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col items-center justify-center space-y-3 mb-5">
                <Input
                  variant="bordered"
                  label="Username"
                  type="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Input
                  variant="bordered"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex items-center"
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isVisible ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </button>
                  }
                  type={isVisible ? "text" : "password"}
                />
              </div>
              <Button
                color="primary"
                className="w-full"
                type="submit"
                loading={isLoading}
              >
                {isLoading ? <Spinner color="white" /> : "Login"}
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
