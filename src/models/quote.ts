import { UserType } from "./auth"
import { VoteType } from "./vote"

export type QuoteType = {
  id:number
  karma:number
  quote:string
  posted_when:string
  user:UserType
  votes:VoteType[]
}