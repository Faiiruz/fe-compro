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
  Textarea,
} from "@nextui-org/react";
import { IoMdArrowBack } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";

export default function Detail() {
  const { query } = useRouter();
  const [header, setHeader] = useState({});
  const [listTitles, setListTitles] = useState([]);
  const [descTitle, setDescTitle] = useState("");
  const [descText, setDescText] = useState("");
  const [images, setImages] = useState([]);
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
      setListTitles(response.data.lists || []);
      if (response.data.descriptions && response.data.descriptions.length > 0) {
        setDescTitle(response.data.descriptions[0].title || "");
        setDescText(response.data.descriptions[0].desc || "");
      }
      setImages(response.data.images || []);
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

  const handleAddOrUpdate = async () => {
    try {
      // Update or Add list titles
      for (const listTitle of listTitles) {
        if (listTitle.id) {
          await axios.put(`http://localhost:3011/lists/${listTitle.id}`, {
            title: listTitle.title,
            desc: listTitle.desc,
            headerId: parseInt(query.id),
          });
        } else {
          await axios.post(`http://localhost:3011/lists`, {
            title: listTitle.title,
            desc: listTitle.desc,
            headerId: parseInt(query.id),
          });
        }
      }

      // Update or Add description
      if (header.descriptions && header.descriptions.length > 0) {
        await axios.put(
          `http://localhost:3011/descriptions/${header.descriptions[0].id}`,
          {
            title: descTitle,
            desc: descText,
            headerId: parseInt(query.id),
          }
        );
      } else {
        await axios.post(`http://localhost:3011/descriptions`, {
          title: descTitle,
          desc: descText,
          headerId: parseInt(query.id),
        });
      }

      // Update or Add images
      for (const image of images) {
        if (image.id) {
          if (image.file) {
            const formData = new FormData();
            formData.append("image", image.file);
            formData.append("title", image.title);
            formData.append("desc", image.desc);
            formData.append("headerId", parseInt(query.id));

            const imageResponse = await axios.put(
              `http://localhost:3011/images/${image.id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            console.log("Image updated:", imageResponse.data);
          }
        } else {
          const formData = new FormData();
          formData.append("image", image.file);
          formData.append("title", image.title);
          formData.append("desc", image.desc);
          formData.append("headerId", parseInt(query.id));

          const imageResponse = await axios.post(
            `http://localhost:3011/images`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Image added:", imageResponse.data);
        }
      }
      setResponse({ success: true });

      onOpenChange();
    } catch (error) {
      console.error("Error:", error);
      setResponse({ success: false, error: error.message });
    }
  };

  const handleAddListTitle = () => {
    setListTitles([...listTitles, { title: "", desc: "" }]);
  };

  const handleRemoveListTitle = (index) => {
    const newListTitles = listTitles.filter((_, i) => i !== index);
    setListTitles(newListTitles);
  };

  const handleListTitleChange = (index, field, value) => {
    const newListTitles = [...listTitles];
    newListTitles[index][field] = value;
    setListTitles(newListTitles);
  };

  const handleAddImage = () => {
    setImages([...images, { file: null, title: "", desc: "" }]);
  };

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...images];
    newImages[index][field] = value;
    setImages(newImages);
  };

  const handleImageFileChange = (index, file) => {
    const newImages = [...images];
    newImages[index].file = file;
    setImages(newImages);
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
        <Button onPress={onOpen}>
          {query.id ? "Edit Content" : "Add Content"}
        </Button>
      </div>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior={scrollBehavior}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {query.id ? "Edit Content" : "Add Content"}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Description Title:</label>
                    <Input
                      variant="bordered"
                      type="text"
                      value={descTitle}
                      onChange={(e) => setDescTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Description Text:</label>
                    <Input
                      variant="bordered"
                      type="text"
                      value={descText}
                      onChange={(e) => setDescText(e.target.value)}
                    />
                  </div>

                  {listTitles.map((listTitle, index) => (
                    <div
                      key={index}
                      className="col-span-2 flex items-center space-x-2"
                    >
                      <div className="flex-grow">
                        <label>List Item {index + 1}:</label>
                        <Input
                          variant="bordered"
                          type="text"
                          value={listTitle.title}
                          onChange={(e) =>
                            handleListTitleChange(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <Button
                        color="secondary"
                        onPress={() => handleRemoveListTitle(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button className="col-span-2" onPress={handleAddListTitle}>
                    <IoMdAdd /> Add List Item
                  </Button>

                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="col-span-2 flex items-center space-x-2"
                    >
                      <div className="flex-grow">
                        <label>Upload Image {index + 1}:</label>
                        <Input
                          variant="bordered"
                          type="file"
                          onChange={(e) =>
                            handleImageFileChange(index, e.target.files[0])
                          }
                          required
                        />
                        <label>Image Title:</label>
                        <Input
                          variant="bordered"
                          type="text"
                          value={image.title}
                          onChange={(e) =>
                            handleImageChange(index, "title", e.target.value)
                          }
                        />
                        <label>Image Description:</label>
                        <Input
                          variant="bordered"
                          type="text"
                          value={image.desc}
                          onChange={(e) =>
                            handleImageChange(index, "desc", e.target.value)
                          }
                        />
                      </div>
                      <Button
                        color="secondary"
                        onPress={() => handleRemoveImage(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}

                  <Button className="col-span-2" onPress={handleAddImage}>
                    <IoMdAdd /> Add Image
                  </Button>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={handleAddOrUpdate}>
                  {query.id ? "Save Changes" : "Add Content"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {header.descriptions?.[0]?.title && (
        <div className="grid grid-cols-2 gap-4 pt-10 pb-2">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold space-y-3">Title Description</h1>
            <Input readOnly value={header.descriptions[0].title} />
          </div>
          {header.descriptions?.[0]?.desc && (
            <div className="flex flex-col">
              <h1 className="text-lg font-bold space-y-3">
                Product Description
              </h1>
              <Textarea readOnly value={header.descriptions[0].desc} />
            </div>
          )}
        </div>
      )}

      {listTitles?.length > 0 && (
        <>
          <h1 className="text-lg font-bold pt-5 ">List</h1>
          {listTitles.map((list, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <Input readOnly value={list.title} />
              </div>
            </div>
          ))}
        </>
      )}

      {images?.length > 0 && (
        <>
          <h1 className="text-lg font-bold pt-5 pb-2">Image</h1>
          {images.map((image, index) => (
            <div key={index} className="grid grid-cols-2 gap-4 pt-4">
              <div>
                <img
                  src={`http://localhost:3011/uploads/${image.image}`}
                  alt={image.title}
                  width={500}
                  height={500}
                />
              </div>
              <div className="flex flex-col space-y-5">
                {image.title && (
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold space-y-3">Image Title</h1>
                    <Input readOnly value={image.title} />
                  </div>
                )}
                {image.desc && (
                  <div className="flex flex-col">
                    <h1 className="text-lg font-bold space-y-3">
                      Image Description
                    </h1>
                    <Textarea readOnly value={image.desc} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      )}

      {response && (
        <div>
          {response.success ? (
            <h2>
              {query.id
                ? "Changes Saved Successfully"
                : "Content Added Successfully"}
            </h2>
          ) : (
            <h2>Error: {response.error}</h2>
          )}
        </div>
      )}
    </Layout>
  );
}
