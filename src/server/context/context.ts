import {prisma} from "../prisma/prisma"

export function createContext(){
  return {prisma}
}

export type Context = ReturnType<typeof createContext>;