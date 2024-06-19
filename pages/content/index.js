import Layout from "@/components/Layout";
import React, { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import "moment/locale/id";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "@sweetalert2/theme-dark/dark.scss";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Pagination,
  Input,
  Link,
} from "@nextui-org/react";
import { IoMdSearch } from "react-icons/io";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function Content() {
  const [headers, setHeaders] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inputTitle, setInputTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const fetchHeaderData = async () => {
    try {
      let url = "http://localhost:3011/header/";
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

  const handleAddHeader = async () => {
    const response = await axios.post("http://localhost:3011/header", {
      title: inputTitle,
    });
    if (response.status === 201) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Header added successfully",
      });
      fetchHeaderData();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to add header",
      });
    }
  };

  const handleEditHeader = async () => {
    const response = await axios.put(`http://localhost:3011/header/${editId}`, {
      title: inputTitle,
    });
    if (response.status === 200) {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Header updated successfully",
      });
      fetchHeaderData();
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Failed to update header",
      });
    }
  };

  const handleDeleteHeader = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this app!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete(
          `http://localhost:3011/header/${id}`
        );
        if (response.status === 200) {
          Swal.fire("Deleted!", "Your app has been deleted.", "success");
          fetchHeaderData();
        } else {
          Swal.fire("Error!", "Failed to delete app.", "error");
        }
      }
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
        <div className="pb-4 text-2xl font-bold">Content</div>
        <Modal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          placement="top-center"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editId ? "Edit Header" : "Add Header"}
                </ModalHeader>
                <ModalBody>
                  <Input
                    autoFocus
                    label="Title"
                    placeholder="Enter Header Title"
                    variant="bordered"
                    value={inputTitle}
                    onChange={(e) => setInputTitle(e.target.value)}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" onPress={onClose}>
                    Close
                  </Button>
                  <Button
                    color="primary"
                    onPress={() => {
                      if (editId) {
                        handleEditHeader();
                      } else {
                        handleAddHeader();
                      }
                      onClose();
                    }}
                  >
                    {editId ? "Update" : "Add"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
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
          <Button
            color="primary"
            startContent={<FaPlus />}
            onPress={() => {
              onOpen();
              setEditId(null);
              setInputTitle("");
            }}
          >
            Add Header
          </Button>
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
            <TableColumn className="text-center">Name</TableColumn>
            <TableColumn className="text-center">Created At</TableColumn>
            <TableColumn className="text-center">Updated At</TableColumn>
            <TableColumn className="text-center">Action</TableColumn>
          </TableHeader>
          <TableBody items={items}>
            {items.map((header) => (
              <TableRow key={header.id}>
                <TableCell className="text-center">
                  <Link underline="always" href={`/content/${header.id}`}>
                    {header.title}
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  {header.createdAt}
                </TableCell>
                <TableCell className="text-center">
                  {header.updatedAt}
                </TableCell>
                <TableCell className="flex justify-center items-center">
                  <Button
                    isIconOnly
                    color="warning"
                    onPress={() => {
                      onOpen();
                      setEditId(header.id);
                      setInputTitle(header.title);
                    }}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    isIconOnly
                    color="error"
                    onPress={() => handleDeleteHeader(header.id)}
                  >
                    <FaTrash />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Layout>
    </>
  );
}
