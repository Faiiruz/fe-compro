import React, { useState, useEffect } from "react";
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import { useRouter } from "next/router";
import axios from "axios";

const Navbar1 = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");

    router.push("/login");
  };

  useEffect(() => {
    // Panggil API untuk mendapatkan data pengguna saat komponen dimuat
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:3011/api/users/current",
          {
            headers: {
              Authorization: token,
              //   Accept: "application/json",
            },
          }
        );
        console.log(user);
        if (response.status == 200) {
          setUser(response.data.data);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="flex items-center justify-end bg-black fixed w-full top-0 left-0 right-0 p-2">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <div className="mr-5 cursor-pointer font-popin">
            {user && <Avatar name={user.name ? user.name : "AA"} size="40px" />}
          </div>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Profile Actions"
          variant="flat"
          className="font-popin"
        >
          <DropdownItem key="profile" className="h-14 gap-2 font-popin">
            <p className="font-semibold">Signed in as</p>
            {user && <p className="font-semibold">{user.name}</p>}
          </DropdownItem>
          <DropdownItem key="settings">Settings</DropdownItem>
          <DropdownItem onClick={handleLogout} key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default Navbar1;
