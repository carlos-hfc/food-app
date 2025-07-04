import "fastify"

import { User } from "generated/prisma"

interface CurrentUser extends Omit<User, "password"> {
  restaurantId?: string
}

declare module "fastify" {
  export interface FastifyRequest {
    getCurrentUser(): Promise<CurrentUser>
    getManagedRestaurantId(): Promise<string>
  }
}
