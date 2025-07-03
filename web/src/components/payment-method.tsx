import { BanknoteIcon, CreditCardIcon, NfcIcon } from "lucide-react"

export type PaymentMethodType = "CARD" | "CASH" | "PIX"

interface PaymentMethodProps {
  paymentMethod: PaymentMethodType
}

const paymentMethodMap: Record<PaymentMethodType, string> = {
  CARD: "Cartão",
  CASH: "Dinheiro",
  PIX: "Pix",
}

export function PaymentMethod({ paymentMethod }: PaymentMethodProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {paymentMethod === "CARD" && <CreditCardIcon className="size-5" />}
      {paymentMethod === "CASH" && <BanknoteIcon className="size-5" />}
      {paymentMethod === "PIX" && <NfcIcon className="size-5" />}
      <span className="font-medium">{paymentMethodMap[paymentMethod]}</span>
    </div>
  )
}
