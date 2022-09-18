export default function valemailateLogin(values){
    const {email,password} = values
    var errors=[]
    var loginval=false
    if(!email){
        errors.push("email cannot be empty")
    }
    else if(!password){
        errors.push("passwordword cannot be empty")
    }
    return errors
    
}