import { api } from "@/lib/axios"

export interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

export async function updateProfile({
  confirmPassword,
  email,
  name,
  password,
  phone,
}: UpdateProfileRequest) {
  await api.patch("/profile", {
    confirmPassword,
    email,
    name,
    password,
    phone,
  })
}
