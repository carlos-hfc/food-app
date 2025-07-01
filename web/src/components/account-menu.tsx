import { BuildingIcon, ChevronDownIcon, LogOutIcon } from "lucide-react"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function AccountMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="flex select-none items-center gap-2"
        >
          Food App
          <ChevronDownIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56"
      >
        <DropdownMenuLabel className="flex flex-col">
          <span>Carlos Faustino</span>
          <span className="text-xs font-normal text-muted-foreground">
            email@email.com
          </span>

          <DropdownMenuSeparator />

          <DropdownMenuItem>
            <BuildingIcon className="mr-2 size-4" />
            <span>Perfil da loja</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
            <LogOutIcon className="mr-2 size-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
