import { useMutation, useQuery } from "@tanstack/react-query"
import {
  ChevronDownIcon,
  HeartIcon,
  LogOutIcon,
  MapPinIcon,
  SquareChartGanttIcon,
  UtensilsCrossedIcon,
} from "lucide-react"
import { Link, useNavigate } from "react-router"

import { getProfile } from "@/http/get-profile"
import { signOut } from "@/http/sign-out"
import { queryClient } from "@/lib/react-query"

import { ProfileDialog } from "./profile-dialog"
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

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    retry: false,
  })

  const { mutateAsync: signOutFn, isPending: isSigningOut } = useMutation({
    mutationFn: signOut,
    onSuccess() {
      queryClient.clear()
      navigate("/", { replace: true })
    },
  })

  if (!profile) return null

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild={true}>
          <div className="flex select-none items-center gap-2 px-2 text-muted-foreground">
            <span className="text-sm lg:text-base font-semibold">
              {isLoadingProfile ? (
                <Skeleton className="h-4 w-20" />
              ) : (
                profile?.name.split(" ")[0]
              )}
            </span>

            <ChevronDownIcon className="size-4" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-56"
        >
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span className="font-bold">{profile?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {profile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem className="flex items-center gap-2">
              <SquareChartGanttIcon className="size-4 text-foreground" />
              <div>
                <span className="block font-semibold">Dados da conta</span>
                <span className="text-xs text-muted-foreground">
                  Minhas informações da conta
                </span>
              </div>
            </DropdownMenuItem>
          </DialogTrigger>

          <DropdownMenuItem
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/pedidos">
              <UtensilsCrossedIcon className="size-4 text-foreground" />
              <div>
                <span className="block font-semibold">Pedidos</span>
                <span className="text-xs text-muted-foreground">
                  Meus pedidos realizados
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/favoritos">
              <HeartIcon className="size-4 text-foreground" />
              <div>
                <span className="block font-semibold">Favoritos</span>
                <span className="text-xs text-muted-foreground">
                  Meus locais favoritos
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="flex items-center gap-2"
          >
            <Link to="/enderecos">
              <MapPinIcon className="size-4 text-foreground" />
              <div>
                <span className="block font-semibold">Endereços</span>
                <span className="text-xs text-muted-foreground">
                  Meus endereços de entrega
                </span>
              </div>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <button
              className="w-full text-primary active:text-primary hover:text-primary!"
              disabled={isSigningOut}
              onClick={() => signOutFn()}
            >
              <LogOutIcon className="size-4 text-primary shrink-0" />
              Sair
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog />
    </Dialog>
  )
}
