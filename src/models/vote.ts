export type VoteType ={
    id:number
    value:boolean
    quote:{
        id:number
        quote:string
        karma:number
    }
    user:{
        id:number
        email:string
    }
}