export type VoteType ={
    id:number
    value:boolean
    quote?:{
        id:number
        quote:string
    }
    user?:{
        id:number
        email:string
    }
}