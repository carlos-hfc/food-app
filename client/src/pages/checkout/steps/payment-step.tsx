import { CreditCardIcon, DollarSignIcon, NfcIcon } from "lucide-react"
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form"

import { PaymentItem } from "./payment-item"

interface PaymentStepProps<T extends FieldValues> {
  name: Path<T>
  register: UseFormRegister<T>
  watch: UseFormWatch<T>
  options?: RegisterOptions<T, Path<T>>
}

export function PaymentStep<T extends FieldValues>({
  name,
  register,
  watch,
  options,
}: PaymentStepProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      <PaymentItem
        {...register(name, options)}
        checked={watch(name) === "card"}
        id="card"
        value="card"
      >
        <CreditCardIcon />
        Cartão
      </PaymentItem>
      <PaymentItem
        {...register(name, options)}
        checked={watch(name) === "cash"}
        id="cash"
        value="cash"
      >
        <DollarSignIcon />
        Dinheiro
      </PaymentItem>
      <PaymentItem
        {...register(name, options)}
        checked={watch(name) === "pix"}
        id="pix"
        value="pix"
      >
        <NfcIcon />
        Pix
      </PaymentItem>
    </div>
  )
}
