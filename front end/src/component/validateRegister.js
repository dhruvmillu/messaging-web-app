export default function validate(values){
    const {email, username,phone,dob,password,rePass,name} = values
    var errors=[]
    var submitVal=true
    var reEmail=/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/
    console.log(reEmail.test(email))
    var temp=[]
    if(!reEmail.test(email)){
        submitVal=false;
        temp.push("enter a valid Email Id")
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(phone){
        if(phone.length!==10){
            submitVal=false;
            temp.push("phone number should be 10 digits long")
        }
        if(!/^\d{10}/.test(phone)){
            submitVal=false;
            temp.push("phone number only contains numbers")
        }
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(dob){
        var DOB = new Date(dob)
        console.log(DOB);
        var curr = new Date()
        var diff= (curr-DOB)/(31536000000)
        if(diff<8){
            submitVal=false;
            temp.push("you should be older than 8 years to register")
        }
    }
    else{
        submitVal=false;
            temp.push("Date Of Birth is a mandatory field")
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(!username){
        submitVal=false;
        temp.push("username cannot be empty")
    }
    else{
        if(username.indexOf(" ")!==-1){
            submitVal=false;
            temp.push("username cannot have spaces")
        }
        if(username.length<8 || username>25){
            submitVal=false;
            temp.push("username should 8 to 25 characters long")
        }
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(!password){
        submitVal=false;
            temp.push("password cannot be empty")
    }
    else{
        if(password.length<8){
            submitVal=false;
            temp.push("password should be greater than 8 characters")
        }
        if(password.indexOf(" ")!==-1){
            submitVal=false;
            temp.push("password cannot have spaces")
        }
        if(!/[A-Z]+/.test(password)){
            submitVal=false;
            temp.push("password must have a Capitial Letter")
        }
        if(!/[a-z]+/.test(password)){
            submitVal=false;
            temp.push("password must have a small Letter")
        }
        if(!/[0-9]+/.test(password)){
            submitVal=false;
            temp.push("password must have a number")
        }
        if(!/[^a-zA-Z0-9 ]+/.test(password)){
            submitVal=false;
            temp.push("password must have a special character")
        }
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(!rePass){
        submitVal=false;
            temp.push("Please re-type password in the second password field")
    }
    else{
        if(rePass!==password){
            submitVal=false;
            temp.push("password does not match")
        }
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    if(!name){
        submitVal=false;
        temp.push("Name cannot be empty")
    }
    if(temp.length!==0){
        errors.push(temp)
        temp=[]
        console.log(temp);
    }
    console.log(submitVal,errors)
    return {submitVal,errors}
}