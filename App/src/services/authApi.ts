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
}

export { AuthApi };
