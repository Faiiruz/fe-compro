import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import "sweetalert2/src/sweetalert2.scss";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { IoMdSearch } from "react-icons/io";
import { useRouter } from "next/router";
import { useMemo } from "react";
import Layout from "@/components/Layout";

export default function Comment() {
  const [contact, setContact] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMessage, setSelectedMessage] = useState(null); // State to hold the selected message

  const rowsPerPage = 4;

  const fetchHeaderData = async () => {
    try {
      let url = "http://localhost:3011/contact";
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
        setContact(
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

  useEffect(() => {
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

  const pages = Math.ceil(contact.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return contact.slice(start, end);
  }, [page, contact]);

  // Function to handle opening modal and setting selected message
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    onOpen(); // Open the modal
  };

  return (
    <>
      <Layout>
        <div className="pb-4 text-2xl font-bold">Comment</div>
        <div className="flex justify-between items-center pb-7">
          <Input
            className="w-1/2"
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
            <TableColumn className="text-center">First Name</TableColumn>
            <TableColumn className="text-center">Last Name</TableColumn>
            <TableColumn className="text-center">Email</TableColumn>
            <TableColumn className="text-center">Message</TableColumn>
            <TableColumn className="text-center">Created At</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {items.map((header) => (
              <TableRow key={header.id}>
                <TableCell className="text-center">
                  {header.firstName}
                </TableCell>
                <TableCell className="text-center">{header.lastName}</TableCell>
                <TableCell className="text-center">{header.email}</TableCell>
                <TableCell
                  onClick={() => handleViewMessage(header.message)}
                  className="text-center cursor-pointer text-blue-600"
                >
                  View Message
                </TableCell>
                <TableCell className="text-center">
                  {header.createdAt}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Modal size="5xl" isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">Message</ModalHeader>
            <ModalBody>
              <div>{selectedMessage}</div>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Layout>
    </>
  );
}
