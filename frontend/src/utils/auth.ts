export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken"); // Replace "authToken" with your actual token key
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
};
