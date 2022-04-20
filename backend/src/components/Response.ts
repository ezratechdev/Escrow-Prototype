interface UserData{
    status:number,
    message:string,
    token?:any,
}

const ResponseFunc = (res:UserData)=>{
    return{
        ...res.status && { status : res.status},
        ...res.message && { message : res.message},
        ...res.token && { token : res.token},
    }
}

export default ResponseFunc;