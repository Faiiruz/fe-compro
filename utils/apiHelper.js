// utils/apiHelper.js
import axios from "axios";

export const updateHeader = async (headerId, headerData) => {
  const { title, list, description, image } = headerData;

  try {
    // Mengirim permintaan ke API /lists, /descriptions, dan /images secara paralel
    const [listResponse, descriptionResponse, imageResponse] = await axios.all([
      axios.post("http://localhost:3011/lists", list),
      axios.post("http://localhost:3011/descriptions", description),
      axios.post("http://localhost:3011/images", image),
    ]);

    // Membuat data untuk API /headers berdasarkan hasil dari ketiga API tersebut
    const headerResponse = await axios.put(
      `http://localhost:3011/headers/${headerId}`,
      {
        title: title,
        listId: listResponse.data.id,
        descId: descriptionResponse.data.id,
        imageId: imageResponse.data.id,
      }
    );

    // Mengirim respons dari API /headers ke frontend
    return headerResponse.data;
  } catch (error) {
    console.error("Error occurred while processing your request:", error);
    throw new Error("Failed to update header");
  }
};
