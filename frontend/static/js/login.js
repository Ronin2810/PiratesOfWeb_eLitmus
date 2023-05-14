const entity = document.getElementById('entity')
const err_entity = document.getElementById('err-entity')

const email = document.getElementById('email')
const err_email = document.getElementById('err-email')

const password = document.getElementById('password')
const err_password = document.getElementById('err-password')

const form  = document.getElementById('form')


entity.addEventListener('change',()=>{
    console.log(entity.value);
    if (entity.value==="") {
        err_entity.innerText = "Required Entity type for login"
    }
    else{
        err_entity.innerText = ""
    }
})

email.addEventListener('input',()=>{
    if (email.value==="") {
        err_email.innerText = "Required Email for login"
    }
    else{
        err_email.innerText = ""
    }
})

password.addEventListener('input',()=>{
    if(password.value===""){
        err_password.innerText = "Required Password for login"
    }
    else{
        err_password.innerText = ""
    }
})

const validateLogin = ()=>{
    if(entity.value==='admin'){
        form.action = '/admin/login'
        return true;
    }
    else if(entity.value==='player'){
        form.action = '/player/login'
        return true;
    }
    else{
        return false;
    }
}