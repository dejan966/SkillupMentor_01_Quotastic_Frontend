import { QuoteType } from "./quote"
import { VoteType } from "./vote"

export type UserType = {
  id: number
  first_name: string
  last_name: string
  email: string
  current_password:string
  password:string
  confirm_password:string
  avatar: string
  quotes:QuoteType[]
  votes:VoteType[]
}