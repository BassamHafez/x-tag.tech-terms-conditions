import axios from "axios";
const baseServerUrl = import.meta.env.VITE_API_BASE_URL;

export const signFormsHandler = async ({ type, formData }) => {
  try {
    const response = await axios.post(
      `${baseServerUrl}api/v1/auth/${type}`,
      formData
    );
    return response;
  } catch (error) {
    if (error.message === "Network Error" && !error.response) {
      const corsError = new Error("CORS error: Request blocked");
      corsError.isCorsError = true;
      throw corsError;
    }

    if (error.response) {
      throw error.response;
    } else if (error.request) {
      throw error.request;
    }
    throw error.message;
  }
};

export const mainDeleteFunHandler = async ({ type,token }) => {
  try {
    const response = await axios.delete(`${baseServerUrl}api/v1/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};
