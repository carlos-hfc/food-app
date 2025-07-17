import { CameraIcon } from "lucide-react"
import { useMemo } from "react"
import {
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form"

import { Input } from "./ui/input"
import { Label } from "./ui/label"

const ACEPTED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"]

interface DropzoneProps<T extends FieldValues> {
  name: Path<T>
  register: UseFormRegister<T>
  watch: UseFormWatch<T>
  options?: RegisterOptions<T, Path<T>>
  image?: string | null
}

export function Dropzone<T extends FieldValues>({
  name,
  register,
  options,
  image,
  watch,
}: DropzoneProps<T>) {
  const imageUrl = useMemo(() => {
    const file = watch(name)
    if (file?.length) {
      return URL.createObjectURL(file[0])
    }

    return image ?? ""
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, watch(name)])

  return (
    <div className="border-dashed border border-input rounded-md w-full h-40 text-sm relative flex items-center justify-center gap-2">
      <Label
        htmlFor={name}
        className="sr-only"
      >
        Adicione a imagem aqui
      </Label>
      <Input
        id={name}
        type={name}
        className="absolute inset-0 w-full h-full opacity-0"
        accept={ACEPTED_IMAGE_TYPES.join()}
        {...register(name, options)}
      />
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Imagem do produto"
          className="size-full object-contain"
        />
      ) : (
        <>
          <CameraIcon className="size-4" />
          Adicione a imagem aqui
        </>
      )}
    </div>
  )
}
