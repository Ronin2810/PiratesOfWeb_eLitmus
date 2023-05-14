const express = require("express")
const admin_router = new express.Router()
const axios = require("axios")


admin_router.post('/admin/login',(req,res)=>{
    let {email,password} = req.body;
    email = email.trim();
    password = password.trim();
    axios.post(`https://pirates-of-web-backend-ronin2810.onrender.com/admin/login`,{email:email,password:password})
    .then((response)=>{
        console.log("Received Response:",response.data);
        if (response.data.res==='OK') {
            req.session.email=response.data.cookie.email
            req.session.entity=response.data.cookie.entity
            req.session.isAuth=response.data.cookie.isAuth
            res.redirect('/admin/dashboard')
        }
        else{
            res.render('login',{err:"Wrong Credentials"})
        }
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('/login')
    })
})

admin_router.get('/admin/dashboard',(req,res)=>{
    console.log("Response for admin dashboard");
    console.log(req.session.isAuth);
    axios.get(`https://pirates-of-web-backend-ronin2810.onrender.com/admin/dashboard`,{params:{isAuth:req.session.isAuth}})
    .then((response)=>{
        if (response.data.res==='OK') {
            console.log("received ok");
            res.render('admin_dashboard',{name:response.data.name,data:response.data.data})
        }
        else{
            console.log("received no");
            res.redirect('/logout')
        }
    })
    .catch((err)=>{
        console.log("received err");
        res.redirect('/logout')
    })

})

admin_router.get('/logout',(req,res)=>{
    console.log("inside logout from admin router");
    axios.get('https://pirates-of-web-backend-ronin2810.onrender.com/logout',{params:{isAuth:'true'}})
    .then((response)=>{
        console.log(response.data.msg);
        res.clearCookie(process.env.COOKIE_NAME)
        req.session.destroy()
        res.render('login',{err:""})
    })
    .catch((err)=>{

    })
    // res.redirect('/login')
})

admin_router.get('/login',(req,res)=>{
    console.log("inside login from admin router");
    axios.get('https://pirates-of-web-backend-ronin2810.onrender.com/logout',{params:{isAuth:'true'}})
    .then((response)=>{
        console.log(response.data.msg);
        res.clearCookie(process.env.COOKIE_NAME)
        req.session.destroy()
        res.render('login',{err:""})
    })
    .catch((err)=>{

    })
})


module.exports = admin_router;