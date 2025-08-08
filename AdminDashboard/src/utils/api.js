import axios from "axios";

export const getData = async (url, id) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response = await axios.get(`/api${url}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
      params: { id },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const postData = async (url, formData, hasFile = false) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const headers = hasFile
      ? { Authorization: `Bearer ${token}` }
      : {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
    const response = await axios.post(`/api${url}`, formData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const putData = async (url, formData) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response = await axios.put(`/api${url}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const putDataJson = async (url, json) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response = await axios.put(`/api${url}`, json, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const deleteData = async (url, id) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response = await axios.delete(`/api${url}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};

export const deleteImage = async (url, publicId) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  try {
    const response = await axios.post(
      `/api${url}`,
      { publicId },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      return error.response.data;
    }
    return null;
  }
};
