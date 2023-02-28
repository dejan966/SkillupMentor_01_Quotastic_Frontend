export type VoteType ={
    id:number
    value:boolean
    quote:{
        id:number
        quote:string
        karma:number
        user:{
            id:number
            avatar:string
            first_name:string
            last_name:string
            email:string
        }
    }
}