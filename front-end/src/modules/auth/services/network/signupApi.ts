import { axiosCrud } from "@/lib/axios/crud";
import { axiosInstance } from "@/lib/axios/instances";
import type { SignUpOutput } from "@/pages/auth/validations";

const API_URL = import.meta.env.VITE_API_URL;

type SignupUser = {
  id: string;
  firstname?: string | null;
  lastname?: string | null;
  pseudo: string;
  email: string;
  role: "USER" | "ADMIN";
  date_created?: string;
  date_updated?: string | null;
  is_active?: boolean;
};

type SignupResponse = {
  user: SignupUser;
};

type SignupApiResult = SignupResponse | SignupUser;

async function signupApi(credentials: SignUpOutput) {
  try {
    if (!credentials) throw new Error("Params not found");
    if (!credentials.pseudo) throw new Error("Pseudo is undefined");
    if (!credentials.email) throw new Error("Email is undefined");
    if (!credentials.password) throw new Error("Password is undefined");

    const payload = {
      pseudo: credentials.pseudo,
      email: credentials.email,
      password: credentials.password,
      ...(credentials.firstname ? { firstname: credentials.firstname } : {}),
      ...(credentials.lastname ? { lastname: credentials.lastname } : {}),
    };

    const response = await axiosCrud(axiosInstance()).post<
      SignupApiResult,
      typeof payload
    >(`${API_URL}/auth/signup`, payload);

    // Some backends return `{ user, token? }`, others return the user directly.
    if ("user" in response) return response;
    return { user: response };
  } catch (error) {
    return Promise.reject(error);
  }
}

export default signupApi;
