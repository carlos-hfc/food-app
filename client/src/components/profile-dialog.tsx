import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { PASSWORD_REGEX } from "@/constants"
import { getProfile, GetProfileResponse } from "@/http/get-profile"
import { signOut } from "@/http/sign-out"
import { updateProfile } from "@/http/update-profile"
import { queryClient } from "@/lib/react-query"

import { Button } from "./ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

const updateProfileSchema = z
  .object({
    name: z.string().optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8)
      .regex(PASSWORD_REGEX, {
        message:
          "Senha deve conter pelo menos 8 caracteres, um letra maiúscula, uma letra minúscula, um número e um caracter especial",
      })
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Senha e confirmação de senha não correspondem",
    path: ["confirmPassword"],
  })

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export function ProfileDialog() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      name: profile?.name ?? "",
      email: profile?.email ?? "",
      phone: profile?.phone ?? "",
    },
  })

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    async onSuccess(_, variables) {
      const cached = queryClient.getQueryData<GetProfileResponse>(["profile"])

      if (cached) {
        if (variables.email && variables.email !== cached.email) {
          await signOut()
          queryClient.clear()
          navigate("/", { replace: true })
        }

        queryClient.setQueryData(["profile"], {
          ...cached,
          ...variables,
        })
      }
    },
  })

  async function handleUpdateProfile(data: UpdateProfileSchema) {
    try {
      await updateProfileFn({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password || undefined,
        confirmPassword: data.confirmPassword || undefined,
      })

      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      toast.error("Falha ao atualizar o seu perfil, tente novamente")
    }
  }

  function handleReset() {
    setShowPassword(false)
    setShowConfirmPassword(false)

    reset()
  }

  return (
    <DialogContent
      onEscapeKeyDown={handleReset}
      onInteractOutside={handleReset}
      onPointerDownOutside={handleReset}
    >
      <DialogHeader>
        <DialogTitle className="text-xl leading-none">Meu perfil</DialogTitle>
        <DialogDescription>Atualize as suas informações</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              {...register("name")}
            />
            {errors.name?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register("phone")}
            />
            {errors.phone?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="username"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className="pr-12"
                autoComplete="new-password"
                {...register("password")}
              />

              <Button
                type="button"
                aria-label="Mostrar e esconder senha"
                size="icon"
                variant="ghost"
                className="hover:bg-transparent absolute right-2"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errors.password?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative flex items-center">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className="pr-12"
                autoComplete="new-password"
                {...register("confirmPassword")}
              />

              <Button
                type="button"
                aria-label="Mostrar e esconder senha"
                size="icon"
                variant="ghost"
                className="hover:bg-transparent absolute right-2"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
              </Button>
            </div>
            {errors.confirmPassword?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              onClick={handleReset}
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
