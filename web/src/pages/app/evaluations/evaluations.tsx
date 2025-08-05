import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import { z } from "zod"

import { Pagination } from "@/components/pagination"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getEvaluations } from "@/http/get-evaluations"

import { EvaluationTableFilters } from "./evaluation-table-filters"
import { EvaluationTableRow } from "./evaluation-table-row"
import { EvaluationTableSkeleton } from "./evaluation-table-skeleton"

export function Evaluations() {
  const [searchParams, setSearchParams] = useSearchParams()

  const rate = searchParams.get("rate")
  const comment = searchParams.get("comment")

  const pageIndex = z.coerce
    .number()
    .transform(page => page - 1)
    .parse(searchParams.get("page") ?? 1)

  const { data: result, isLoading: isLoadingEvaluations } = useQuery({
    queryKey: ["evaluations", pageIndex, rate, comment],
    queryFn: () => getEvaluations({ pageIndex, rate, comment }),
  })

  function handlePaginate(pageIndex: number) {
    setSearchParams(prev => {
      prev.set("page", String(pageIndex + 1))

      return prev
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Avaliações</h1>

      <div className="space-y-2.5">
        <EvaluationTableFilters />

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16" />
                <TableHead className="w-72">Identificador</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="w-16">Nota</TableHead>
                <TableHead className="w-72">Comentário</TableHead>
                <TableHead className="w-44">Avaliado em</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoadingEvaluations && <EvaluationTableSkeleton />}

              {result?.evaluations.map(evaluation => (
                <EvaluationTableRow
                  key={evaluation.id}
                  evaluation={evaluation}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {result && (
          <Pagination
            pageIndex={result.meta.pageIndex}
            totalCount={result.meta.totalCount}
            perPage={result.meta.perPage}
            onPageChange={handlePaginate}
          />
        )}
      </div>
    </div>
  )
}
