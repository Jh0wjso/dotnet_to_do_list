export const API_LINK = import.meta.env.VITE_API_LINK;

export const AUTH_LINKS = {
  LOGIN: `${API_LINK}/api/Auth/login`,
  SIGNUP: `${API_LINK}/api/Auth/signup`,
  CONFIRM_EMAIL: `${API_LINK}/api/Auth/confirm-email`,
  RESEND_CONFIRMATION: `${API_LINK}/api/Auth/resend-confirmation`,
};

