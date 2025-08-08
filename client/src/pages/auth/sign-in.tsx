import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/http/sign-in"

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
})

type SignInSchema = z.infer<typeof signInSchema>

export function SignIn() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  })

  const { mutateAsync: signInFn } = useMutation({
    mutationFn: signIn,
    onSuccess() {
      sessionStorage.setItem("isLogged", "true")
      navigate(searchParams.get("redirectTo") || "/restaurantes", {
        replace: true,
      })
    },
  })

  async function handleSignIn(data: SignInSchema) {
    try {
      await signInFn({
        email: data.email,
        password: data.password,
      })

      toast.success("Login efetuado com sucesso!")
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 400) {
          toast.error("Credencias inválidas")
        }
      } else {
        toast.error("Erro inesperado, tente novamente")
      }
    }
  }

  return (
    <div className="p-4 md:p-8">
      <Button
        asChild
        className="absolute left-4 top-4 md:left-8 md:top-8"
        variant="link"
      >
        <Link to="/">
          <ArrowLeftIcon />
          Voltar
        </Link>
      </Button>
      <Button
        asChild
        className="absolute right-4 top-4 md:right-8 md:top-8"
        variant="ghost"
      >
        <Link to="/sign-up">Criar conta</Link>
      </Button>

      <Seo title="Login" />
      <div className="flex flex-col justify-center gap-6 max-w-80">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">Acessar minha conta</h1>
          <p className="text-sm text-muted-foreground">
            Encontre o restaurante de sua escolha e faça seus pedidos
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleSignIn)}
        >
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
                autoComplete="current-password"
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
