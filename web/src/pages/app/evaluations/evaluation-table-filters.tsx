import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const evaluationFilterSchema = z.object({
  grade: z.string().optional(),
  comment: z.string().optional(),
})

type EvaluationFilterSchema = z.infer<typeof evaluationFilterSchema>

export function EvaluationTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const grade = searchParams.get("grade")
  const comment = searchParams.get("comment")

  const { handleSubmit, control, reset } = useForm<EvaluationFilterSchema>({
    resolver: zodResolver(evaluationFilterSchema),
    defaultValues: {
      grade: grade ?? "all",
      comment: comment ?? "all",
    },
  })

  function handleFilter(data: EvaluationFilterSchema) {
    setSearchParams(prev => {
      if (data.comment) {
        prev.set("comment", data.comment)
      } else {
        prev.delete("comment")
      }

      if (data.grade) {
        prev.set("grade", data.grade)
      } else {
        prev.delete("grade")
      }

      prev.set("page", "1")

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete("page")
      prev.delete("grade")
      prev.delete("comment")

      return prev
    })

    reset()
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-sm font-semibold">Filtros</span>

      <Controller
        name="grade"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue="all"
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="h-8 w-42">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todas as notas</SelectItem>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="4">4</SelectItem>
              <SelectItem value="5">5</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue="all"
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="h-8 w-60">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos os comentários</SelectItem>
              <SelectItem value="true">Com comentário</SelectItem>
              <SelectItem value="false">Sem comentário</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button
        type="submit"
        variant="secondary"
        size="xs"
      >
        Filtrar resultados
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={handleClearFilters}
      >
        Remover filtros
      </Button>
    </form>
  )
}
