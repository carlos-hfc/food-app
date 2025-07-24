"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PASSWORD_REGEX, WEEKDAYS } from "@/constants"
import { getCategories } from "@/http/get-categories"
import { signUp } from "@/http/sign-up"

const signUpForm = z.object({
  managerName: z.string(),
  restaurantName: z.string(),
  email: z.string().email("E-mail inválido"),
  password: z.string().refine(value => PASSWORD_REGEX.test(value), {
    message:
      "A senha deve conter ao menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caracter especial",
  }),
  phone: z.string(),
  tax: z.coerce.number().optional(),
  deliveryTime: z.coerce.number().min(30).max(120),
  categoryId: z.string().uuid(),
  openedAt: z.string(),
  closedAt: z.string(),
  hours: z.array(z.number()),
})

type SignUpForm = z.infer<typeof signUpForm>

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpForm),
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  })

  const { mutateAsync: signUpFn } = useMutation({
    mutationFn: signUp,
  })

  async function handleSignUp(data: SignUpForm) {
    const hours = Array.from({ length: 7 }, (_, i) => {
      return {
        weekday: String(i),
        open: data.hours.includes(i),
        openedAt: data.openedAt,
        closedAt: data.closedAt,
      }
    })

    try {
      await signUpFn({
        categoryId: data.categoryId,
        deliveryTime: data.deliveryTime,
        email: data.email,
        password: data.password,
        phone: data.phone,
        tax: data.tax ?? 0,
        managerName: data.managerName,
        restaurantName: data.restaurantName,
        hours,
      })

      toast.success("Restaurante cadastrado com sucesso!", {
        action: {
          label: "Login",
          onClick: () => navigate(`/sign-in?email=${data.email}`),
        },
      })
    } catch (error) {
      toast.error("Erro ao cadastrar restaurante.")
    }
  }

  return (
    <div className="py-8">
      <Button
        asChild
        className="absolute right-8 top-8"
        variant={"ghost"}
      >
        <Link to="/sign-in">Fazer login</Link>
      </Button>

      <div className="flex flex-col justify-center gap-6 w-[400px]">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Criar conta grátis
          </h1>
          <p className="text-sm text-muted-foreground">
            Seja uma pareciro e comece suas vendas!
          </p>
        </div>

        <form
          className="space-y-4 px-8 overflow-auto"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <div className="space-y-2">
            <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
            <Input
              id="restaurantName"
              type="text"
              {...register("restaurantName")}
            />
            {errors.restaurantName?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.restaurantName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="managerName">Seu nome</Label>
            <Input
              id="managerName"
              type="text"
              {...register("managerName")}
            />
            {errors.managerName?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.managerName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Seu celular</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
            />
            {errors.phone?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.phone.message}
              </p>
            )}
          </div>

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

          <div className="flex flex-row gap-2">
            <div className="space-y-2 w-full">
              <Label htmlFor="deliveryTime">Tempo de entrega</Label>
              <Input
                id="deliveryTime"
                type="number"
                defaultValue={30}
                min={30}
                max={90}
                {...register("deliveryTime")}
              />
              {errors.deliveryTime?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.deliveryTime.message}
                </p>
              )}
            </div>
            <div className="space-y-2 w-full">
              <Label htmlFor="tax">Taxa</Label>
              <Input
                id="tax"
                type="number"
                defaultValue={0}
                min={0}
                {...register("tax")}
              />
              {errors.tax?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.tax.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(item => (
                      <SelectItem
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId?.message && (
              <p className="text-xs text-destructive font-medium">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Horário de funcionamento</Label>

            <div className="flex flex-wrap justify-between gap-2">
              {WEEKDAYS.map((item, i) => (
                <Controller
                  key={i}
                  name="hours"
                  control={control}
                  render={({ field }) => (
                    <div
                      className="flex items-center justify-center gap-1 relative size-10"
                      title={item}
                    >
                      <Checkbox
                        id="hours"
                        className="absolute size-full"
                        checked={field.value?.includes(i)}
                        onCheckedChange={checked => {
                          return checked
                            ? field.onChange([...(field.value ?? []), i])
                            : field.onChange(
                                field.value?.filter(value => value !== i),
                              )
                        }}
                      />

                      <span className="text-muted-foreground text-lg font-medium leading-none">
                        {item.charAt(0)}
                      </span>
                    </div>
                  )}
                />
              ))}
              {errors.hours?.message && (
                <p className="text-xs text-destructive font-medium">
                  {errors.hours.message}
                </p>
              )}
            </div>

            <div className="flex flex-row gap-2">
              <div className="space-y-2 w-full">
                <Label htmlFor="openedAt">Horário de abertura</Label>
                <Input
                  id="openedAt"
                  type="time"
                  className="scheme-dark"
                  {...register("openedAt")}
                />
                {errors.openedAt?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.openedAt.message}
                  </p>
                )}
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="closedAt">Horário de fechamento</Label>
                <Input
                  id="closedAt"
                  type="time"
                  className="scheme-dark"
                  {...register("closedAt")}
                />
                {errors.closedAt?.message && (
                  <p className="text-xs text-destructive font-medium">
                    {errors.closedAt.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <Button
            type="submit"
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
