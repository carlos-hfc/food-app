import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/http/sign-up"

const signUpSchema = z.object({
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(8),
  phone: z.string().min(3),
})

type SignUpSchema = z.infer<typeof signUpSchema>

export function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp(data: SignUpSchema) {
    try {
      await signUpFn({
        email: data.email,
        name: data.name,
        password: data.password,
        phone: data.phone,
      })

      toast.success("Cadastro realizado com sucesso!", {
        classNames: {
          actionButton: "bg-primary!",
        },
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch (error) {
      toast.error("Erro ao se cadastrar, tente novamente")
    }
  }

  return (
    <div className="p-8">
      <Button
        asChild
        className="absolute left-8 top-8"
        variant="link"
      >
        <Link to="/">
          <ArrowLeftIcon />
          Voltar
        </Link>
      </Button>
      <Button
        asChild
        className="absolute right-8 top-8"
        variant="ghost"
      >
        <Link to="/sign-in">Fazer login</Link>
      </Button>

      <Seo title="Criar conta" />

      <div className="flex flex-col justify-center gap-6 w-80">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">Criar conta</h1>
          <p className="text-sm text-muted-foreground">
            Crie sua conta e faça seu pedido
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleSignUp)}
        >
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            Finalizar cadastro
          </Button>

          <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
            Ao continuar, você concorda com nossos{" "}
            <a
              href=""
              className="underline underline-offset-4"
            >
              Termos de Serviço
            </a>{" "}
            e{" "}
            <a
              href=""
              className="underline underline-offset-4"
            >
              Políticas de Privacidade
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
