import { appConfig } from "../config/env";
import { api, downloadBlob } from "./apiClient";

const wait = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

export async function importAccounts(type, file) {
  if (appConfig.useMockApi) {
    await wait(900);
    return { createdCount: 4, failedRows: [], mock: true };
  }
  const formData = new FormData();
  formData.append("file", file);
  const endpoint = type === "teacher" ? "/admin/teachers/import" : "/admin/students/import";
  return api.post(endpoint, formData);
}

export async function downloadAccountTemplate(type) {
  if (appConfig.useMockApi) return false;
  const endpoint = type === "teacher"
    ? "/admin/templates/teachers-csv"
    : "/admin/templates/students-csv";
  const blob = await api.download(endpoint);
  downloadBlob(blob, `template-${type === "teacher" ? "guru" : "siswa"}.csv`);
  return true;
}

