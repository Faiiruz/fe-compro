import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardBody,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  Pagination,
  TableRow,
} from "@nextui-org/react";
import { IoMdSearch } from "react-icons/io";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Home() {
  const [countHeader, setCountHeader] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        let url = "http://localhost:3011/headers";
        const params = new URLSearchParams(router.query);
        const search = params.get("search");
        if (search) {
          url += `?search=${encodeURIComponent(search)}`;
        }
        const response = await axios.get(url);
        if (response.status === 200) {
          const headersData = response.data;
          const filteredHeaders = search
            ? headersData.filter((header) =>
                header.title.toLowerCase().includes(search.toLowerCase())
              )
            : headersData;
          setCountHeader(filteredHeaders.length);
          setHeaders(
            filteredHeaders.map((header) => ({
              ...header,
              createdAt: moment(header.createdAt).locale("id").format("lll"),
              updatedAt: moment(header.updatedAt).locale("id").format("lll"),
            }))
          );
        } else {
          console.error("Failed to fetch header data");
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };

    fetchHeaderData();
  }, [router.query.search]);

  useEffect(() => {
    const search = router.query.search || "";
    setSearchTerm(search);
  }, [router.query.search]);

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, search: searchValue },
    });
  };

  const pages = Math.ceil(headers.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return headers.slice(start, end);
  }, [page, headers]);

  return (
    <>
      <Layout>
        <div className="pb-4 text-2xl font-bold">Dashboard</div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardBody className="flex flex-row justify-between items-center">
              <div className="text-xl font-bold">Content</div>
              <div className="text-base">{countHeader}</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="flex flex-row justify-between items-center">
              <div className="text-xl font-bold">Contact</div>
              <div className="text-base">0</div>
            </CardBody>
          </Card>
        </div>
        <div className="pt-10 pb-5 font-popin">
          <Input
            label="Search"
            isClearable
            radius="lg"
            placeholder="Type to search..."
            startContent={<IoMdSearch />}
            onChange={handleSearch}
            value={searchTerm}
          />
        </div>
        <Table
          isStriped
          aria-label="Table"
          bottomContent={
            <div className="flex w-full justify-end">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>Created At</TableColumn>
            <TableColumn>Updated At</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {items.map((header) => (
              <TableRow key={header.id}>
                <TableCell>{header.title}</TableCell>
                <TableCell>{header.createdAt}</TableCell>
                <TableCell>{header.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
