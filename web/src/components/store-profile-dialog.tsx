import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { WEEKDAYS } from "@/constants"
import { getCategories } from "@/http/get-categories"
import { getManagedRestaurant } from "@/http/get-managed-restaurant"
import { updateRestaurant } from "@/http/update-restaurant"
import { queryClient } from "@/lib/react-query"

import { Button } from "./ui/button"
import { Checkbox } from "./ui/checkbox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const updateRestaurantForm = z.object({
  name: z.string(),
  phone: z.string(),
  tax: z.coerce.number(),
  deliveryTime: z.coerce.number().min(30).max(90),
  categoryId: z.string().uuid(),
  openedAt: z.string(),
  closedAt: z.string(),
  hours: z.array(z.number().nullable()),
})

type UpdateRestaurantForm = z.infer<typeof updateRestaurantForm>

export function StoreProfileDialog() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: Infinity,
  })

  const { data: managedRestaurant } = useQuery({
    queryFn: getManagedRestaurant,
    queryKey: ["managed-restaurant"],
    staleTime: Infinity,
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
    reset,
  } = useForm<UpdateRestaurantForm>({
    resolver: zodResolver(updateRestaurantForm),
    values: {
      categoryId: managedRestaurant?.categoryId ?? "",
      name: managedRestaurant?.name ?? "",
      phone: managedRestaurant?.phone ?? "",
      tax: managedRestaurant?.tax ?? 0,
      deliveryTime: managedRestaurant?.deliveryTime ?? 30,
      openedAt: managedRestaurant?.hours[0].openedAt ?? "",
      closedAt: managedRestaurant?.hours[0].closedAt ?? "",
      hours:
        managedRestaurant?.hours
          .filter(hour => hour.open && String(hour.weekday))
          .map(item => item.weekday)
          .sort((a, b) => (a < b ? -1 : 1)) ?? [],
    },
  })

  const { mutateAsync: updateRestaurantFn } = useMutation({
    mutationFn: updateRestaurant,
    onSuccess(_, variables) {
      const cached = queryClient.getQueryData(["managed-restaurant"])

      if (cached) {
        queryClient.setQueryData(["managed-restaurant"], {
          ...cached,
          ...variables,
          hours: variables.hours.map(item => ({
            ...item,
            id: item.hourId,
          })),
        })
      }
    },
  })

  async function handleUpdateRestaurant(data: UpdateRestaurantForm) {
    const hours = managedRestaurant!.hours.map(hour => {
      return {
        hourId: hour.id,
        open: data.hours.includes(hour.weekday),
        openedAt: data.openedAt,
        closedAt: data.closedAt,
        weekday: hour.weekday,
      }
    })

    try {
      await updateRestaurantFn({
        id: managedRestaurant!.id,
        categoryId: data.categoryId,
        name: data.name,
        phone: data.phone,
        deliveryTime: data.deliveryTime,
        tax: data.tax,
        hours,
      })

      toast.success("Perfil atualizado com sucesso!")
    } catch (error) {
      toast.error("Falha ao atualizar o perfil, tente novamente")
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do seu estabelecimento visíveis ao seu cliente
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateRestaurant)}>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              {...register("phone")}
            />
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
              </div>
              <div className="space-y-2 w-full">
                <Label htmlFor="closedAt">Horário de fechamento</Label>
                <Input
                  id="closedAt"
                  type="time"
                  className="scheme-dark"
                  {...register("closedAt")}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant={"ghost"}
              onClick={() => reset()}
            >
              Cancelar
            </Button>
          </DialogClose>

          <Button
            type="submit"
            variant={"success"}
            disabled={isSubmitting}
          >
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
