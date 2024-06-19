import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { IoMdArrowBack } from "react-icons/io";

export default function Detail() {
  const { query } = useRouter();
  const [header, setHeader] = useState([]);
  const router = useRouter();

  const fetchHeaderData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3011/header/${query.id}`
      );
      setHeader(response.data);
    } catch (error) {
      console.error("Error fetch");
    }
  };

  useEffect(() => {
    if (query.id) {
      fetchHeaderData();
    }
  }, [query.id]);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <>
      <Layout>
        <div className="cursor-pointer" onClick={handleGoBack}>
          <IoMdArrowBack />
        </div>

        <h1>Detail {header.title}</h1>
        <Input
          isReadOnly
          type="text"
          label="Email"
          variant="bordered"
          defaultValue={header.title}
          className="max-w-xs"
        />
      </Layout>
    </>
  );
}
