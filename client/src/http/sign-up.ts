import { api } from "@/lib/axios"

export interface SignUpRequest {
  name: string
  phone: string
  email: string
  password: string
}

export async function signUp({ email, name, password, phone }: SignUpRequest) {
  await api.post("/session/register", {
    email,
    name,
    password,
    phone,
  })
}
