export const SUPPORTED_IMPORT_EXTENSIONS = [".xlsx", ".csv"];
export const MAX_IMPORT_FILE_SIZE = 10 * 1024 * 1024;

function getFileExtension(fileName) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

export function formatImportFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function validateImportFile(file) {
  if (!file) return "";
  if (file.size > MAX_IMPORT_FILE_SIZE) return "Ukuran file maksimal 10MB.";

  const extensionAllowed = SUPPORTED_IMPORT_EXTENSIONS.includes(getFileExtension(file.name));
  if (!extensionAllowed) {
    return "Format file tidak didukung. Gunakan .xlsx atau .csv.";
  }
  return "";
}
