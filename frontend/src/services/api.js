
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  timeout: 120000,
});

export async function getDocuments() {
  const response = await api.get("documents/");
  return response.data;
}

export async function uploadDocument(file) {
  const formData = new FormData();

  formData.append("title", file.name.replace(/\.pdf$/i, ""));
  formData.append("file", file);

  const response = await api.post("documents/", formData);

  return response.data;
}

export async function askQuestion(question) {
  const response = await api.post("chat/", {
    question,
  });

  return response.data;
}

export default api;
