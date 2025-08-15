import { useMutation, useQuery } from "@tanstack/react-query"
import { BuildingIcon, ChevronDownIcon, LogOutIcon } from "lucide-react"
import { useNavigate } from "react-router"

import { getManagedRestaurant } from "@/http/get-managed-restaurant"
import { signOut } from "@/http/sign-out"
import { queryClient } from "@/lib/react-query"

import { StoreProfileDialog } from "./store-profile-dialog"
import { Button } from "./ui/button"
import { Dialog, DialogTrigger } from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"

export function AccountMenu() {
  const navigate = useNavigate()

  const { data: managedRestaurant, isLoading: isLoadingRestaurant } = useQuery({
    queryFn: getManagedRestaurant,
    queryKey: ["managed-restaurant"],
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess() {
      queryClient.clear()
      navigate("/sign-in", { replace: true })
    },
  })

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"outline"}
            className="flex select-none items-center gap-2"
          >
            {isLoadingRestaurant ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              managedRestaurant?.name
            )}
            <ChevronDownIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56"
        >
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingRestaurant ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span>{managedRestaurant?.admin?.name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {managedRestaurant?.admin?.email}
                </span>
              </>
            )}

            <DropdownMenuSeparator />

            <DialogTrigger asChild>
              <DropdownMenuItem>
                <BuildingIcon className="mr-2 size-4" />
                <span>Perfil da loja</span>
              </DropdownMenuItem>
            </DialogTrigger>

            <DropdownMenuItem
              asChild
              disabled={isSigningOut}
              className="text-rose-500 dark:text-rose-400"
            >
              <button
                className="w-full"
                onClick={() => signOutFn()}
              >
                <LogOutIcon className="mr-2 size-4" />
                <span>Sair</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>

      <StoreProfileDialog />
    </Dialog>
  )
}
