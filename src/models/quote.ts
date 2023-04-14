import { VoteType } from "./vote"

export type QuoteType = {
  id:number
  karma:number
  quote:string
  posted_when:string
  user:{
    id:number
    first_name:string
    last_name:string
    avatar:string
  }
  votes:VoteType[]
}