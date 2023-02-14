export type QuoteType = {
    id:number
    quote:string
    posted_when:string
    user?:{
        id:number
        email:string
    }
  }