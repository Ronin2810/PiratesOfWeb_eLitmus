const name = document.getElementById('name')
const err_name = document.getElementById('err-name')

const email = document.getElementById('email')
const err_email = document.getElementById('err-email')

const password = document.getElementById('password')
const err_password = document.getElementById('err-password')

const confirm_password = document.getElementById('confirm-password')
const err_confirm_password = document.getElementById('err-confirm-password')



name.addEventListener('input',()=>{
    console.log(name.value);
    if (name.value==="") {
        err_name.innerText = "Required name type for register"
    }
    else{
        err_name.innerText = ""
    }
})

email.addEventListener('input',()=>{
    console.log(email.value);

    if (email.value==="") {
        err_email.innerText = "Required Email for register"
    }
    else{
        err_email.innerText = ""
    }
})

password.addEventListener('input',()=>{
    console.log(password.value);

    if(password.value===""){
        err_password.innerText = "Required Password for register"
    }
    else{
        err_password.innerText = ""
    }
})

confirm_password.addEventListener('input',()=>{
    console.log(confirm_password.value);

    if(confirm_password.value===""){
        err_confirm_password.innerText = "Required Password for register"
    }
    else if(password.value!=confirm_password.value){
        err_confirm_password.innerText = "Password and Confirm-Password must be same"
    }
    else{
        err_confirm_password.innerText = ""
    }
})

const validateRegister = ()=>{
    if(password.value!==confirm_password.value){
        err_confirm_password.innerText = "Password and Confirm-Password must be same"
        return false;
    }
    else {
        return true;
    }
}