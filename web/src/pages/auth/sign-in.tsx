import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/http/sign-in"

const signInForm = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(8, "A senha deve conter pelo menos 8 caracteres"),
})

type SignInForm = z.infer<typeof signInForm>

export function SignIn() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<SignInForm>({
    resolver: zodResolver(signInForm),
  })

  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  })

  async function handleSignIn(data: SignInForm) {
    try {
      await authenticate(data)

      toast.success("Login efetuado com sucesso")

      navigate("/", { replace: true })
    } catch (error) {
      toast.error("Credenciais inválidas")
    }
  }

  return (
    <div className="p-8">
      <Button
        asChild
        className="absolute right-8 top-8"
        variant={"ghost"}
      >
        <Link to="/sign-up">Novo estabelecimento</Link>
      </Button>

      <div className="flex flex-col justify-center gap-6 w-[320px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Acessar painel
          </h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe suas vendas pelo painel do parceiro
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Seu e-mail</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Sua senha</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            Acessar painel
          </Button>
        </form>
      </div>
    </div>
  )
}
