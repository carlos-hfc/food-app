import { api } from "@/lib/axios"

export interface SignInRequest {
  email: string
  password: string
  role: string
}

export async function signIn({ email, password, role }: SignInRequest) {
  await api.post("/session/authenticate", {
    email,
    password,
    role,
  })
}
