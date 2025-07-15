import { useQuery } from "@tanstack/react-query"
import { format, formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@/components/ui/table"
import { getEvaluationDetails } from "@/http/get-evaluation-details"

import { EvaluationDetailsSkeleton } from "./evaluation-details-skeleton"

interface EvaluationDetailsProps {
  orderId: string
  open: boolean
}

export function EvaluationDetails({ open, orderId }: EvaluationDetailsProps) {
  const { data: evaluation } = useQuery({
    queryKey: ["evaluation", orderId],
    queryFn: () => getEvaluationDetails({ orderId }),
    enabled: open,
  })

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Pedido: {orderId}</DialogTitle>
        <DialogDescription>Detalhes da avaliação</DialogDescription>
      </DialogHeader>

      {evaluation ? (
        <div className="space-y-6">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Cliente</TableCell>
                <TableCell className="flex justify-end">
                  {evaluation.client.name}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">
                  Telefone
                </TableCell>
                <TableCell className="flex justify-end">
                  {evaluation.client.phone}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">E-mail</TableCell>
                <TableCell className="flex justify-end">
                  {evaluation.client.email}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">
                  Realizado há
                </TableCell>
                <TableCell className="flex justify-end">
                  <time
                    dateTime={evaluation.date}
                    title={format(
                      new Date(evaluation.date),
                      "dd/MM/yyyy', 'HH:mm",
                    )}
                  >
                    {formatDistanceToNow(new Date(evaluation.date), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </time>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="text-muted-foreground">Nota</TableCell>
                <TableCell className="text-right">{evaluation.grade}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground">
                  Avaliado há
                </TableCell>
                <TableCell className="text-right">
                  <time
                    dateTime={evaluation.ratingDate}
                    title={format(
                      new Date(evaluation.ratingDate),
                      "dd/MM/yyyy', 'HH:mm",
                    )}
                  >
                    {formatDistanceToNow(new Date(evaluation.ratingDate), {
                      locale: ptBR,
                      addSuffix: true,
                    })}
                  </time>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="text-muted-foreground align-top">
                  Comentário
                </TableCell>
                <TableCell className="text-right">
                  {evaluation.comment ?? "-"}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Table>
            <TableBody>
              <TableRow>
                <TableHead>Produtos</TableHead>
                <TableHead className="text-right">Qtd.</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableBody>

            <TableBody>
              {evaluation.products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="text-muted-foreground">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-right">
                    {product.price.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {(product.price * product.quantity).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      },
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Taxa</TableCell>
                <TableCell className="text-right font-medium">
                  {evaluation.tax.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3}>Total do pedido</TableCell>
                <TableCell className="text-right font-medium">
                  {evaluation.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      ) : (
        <EvaluationDetailsSkeleton />
      )}
    </DialogContent>
  )
}
