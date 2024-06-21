import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { IoMdArrowBack } from "react-icons/io";

export default function Detail() {
  const { query } = useRouter();
  const [header, setHeader] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [listDesc, setListDesc] = useState("");
  const [descTitle, setDescTitle] = useState("");
  const [descText, setDescText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [imageDesc, setImageDesc] = useState("");
  const [response, setResponse] = useState(null);
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [scrollBehavior, setScrollBehavior] = useState("outside");

  const fetchHeaderData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3011/headers/${query.id}`
      );
      setHeader(response.data);
      console.log(query.id);
    } catch (error) {
      console.error("Error fetching header data:", error);
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

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:3011/lists`, {
        title: listTitle,
        desc: listDesc,
        headerId: parseInt(query.id),
      });

      await axios.post(`http://localhost:3011/descriptions`, {
        title: descTitle,
        desc: descText,
        headerId: parseInt(query.id),
      });

      await axios.post(`http://localhost:3011/images`, {
        image: imageUrl,
        title: imageTitle,
        desc: imageDesc,
        headerId: parseInt(query.id),
      });

      setResponse({ success: true });
      onOpenChange();
    } catch (error) {
      console.error("Error:", error);
      setResponse({ success: false, error: error.message });
    }
  };

  return (
    <Layout>
      <div className="flex items-center space-x-5">
        <div className="cursor-pointer" onClick={handleGoBack}>
          <IoMdArrowBack />
        </div>
        <h1 className="text-xl font-bold">Detail {header.title}</h1>
      </div>
      <div className="pt-5 flex items-center justify-end">
        <Button onPress={onOpen}>Add Content</Button>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Content
              </ModalHeader>
              <ModalBody>
                <div>
                  <label>List Title:</label>
                  <Input
                    type="text"
                    value={listTitle}
                    onChange={(e) => setListTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>List Description:</label>
                  <Input
                    type="text"
                    value={listDesc}
                    onChange={(e) => setListDesc(e.target.value)}
                  />
                </div>
                <div>
                  <label>Description Title:</label>
                  <Input
                    type="text"
                    value={descTitle}
                    onChange={(e) => setDescTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Description Text:</label>
                  <Input
                    type="text"
                    value={descText}
                    onChange={(e) => setDescText(e.target.value)}
                  />
                </div>
                <div>
                  <label>Image URL:</label>
                  <Input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label>Image Title:</label>
                  <Input
                    type="text"
                    value={imageTitle}
                    onChange={(e) => setImageTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label>Image Description:</label>
                  <Input
                    type="text"
                    value={imageDesc}
                    onChange={(e) => setImageDesc(e.target.value)}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleSubmit}>
                  Add Content
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {response && (
        <div>
          {response.success ? (
            <h2>Content Added Successfully</h2>
          ) : (
            <h2>Error: {response.error}</h2>
          )}
        </div>
      )}
    </Layout>
  );
}
