import { AUTH_LINKS } from "@/hooks/useAuthLinks.links";

const AuthApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(AUTH_LINKS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  },
  signup: async (payload: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await fetch(AUTH_LINKS.SIGNUP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during signup:", error);
      throw error;
    }
  },

  resendConfirmation: async (email: string) => {
    try {
      const response = await fetch(AUTH_LINKS.RESEND_CONFIRMATION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Resend confirmation failed");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error during resend confirmation:", error);
      throw error;
    }
  },
};

export { AuthApi };
