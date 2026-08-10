export const appConfig = {
  apiBaseUrl: String(import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api").replace(/\/$/, ""),
  appName: import.meta.env.VITE_APP_NAME || "EduTrack",
  appEnvironment: import.meta.env.VITE_APP_ENV || import.meta.env.MODE,
  useMockApi:
    import.meta.env.VITE_USE_MOCK_API == null
      ? import.meta.env.DEV
      : import.meta.env.VITE_USE_MOCK_API === "true",
};

