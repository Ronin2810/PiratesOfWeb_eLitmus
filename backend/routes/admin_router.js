const express = require('express')
const admin_router = new express.Router()
const controller = require('../controller/admin_controller')
const db = require('../db/conn')


admin_router.post('/admin/login',controller.login,async(req,res)=>{
    console.log("request received");
    if (req.session.isAuth) {
        // res.redirect('/admin/dashboard')
        console.log("sending OK for login");
        // console.log(req.session.isAuth)
        const cookie = {
            email:req.session.email,
            entity:req.session.entity,
            isAuth:req.session.isAuth
        }
        res.send({res:"OK",cookie:cookie})
        return
    } else {
        // res.redirect('/login')
        console.log("sending NO for login");
        const cookie = {isAuth:false}
        res.send({res:"NO",cookie:cookie})
        return
    }
})

admin_router.get('/admin/dashboard',controller.isAuth,async(req,res)=>{
    console.log('request received for admin dashboard');
    try {
        await db.promise().query(`select * from admin where admin_email='${req.session.email}';`)
        .then(async(data)=>{
            const admin = data[0];
            const name  = admin.admin_name;
            let user_data
            await db.promise().query('select * from users natural join user_status;')
            .then((data)=>{
                user_data = data[0];
            })
            .catch((err)=>{
                console.log(err);
            })

            // res.render('admin_dashboard',{name:name,data:user_data})
            console.log("Sending OK for admin dashboard");
            res.send({res:"OK",name:name,data:user_data})
            return 
        })
        .catch((err)=>{
            console.log(err);
            // res.redirect('/logout')
            console.log("Sending NO for admin dashboard");
            const cookie = {isAuth:false}
            res.send({res:"NO",cookie:cookie})
        })
        
    } catch (error) {
        console.log(error);
        // res.redirect('/logout')
        const cookie = {isAuth:false}
        res.send({res:"NO",cookie:cookie})
    }
})


admin_router.get('/logout',controller.isAuth,async(req,res)=>{
    res.clearCookie(process.env.COOKIE_NAME)
    req.session.destroy()
    // res.redirect("/login")
    res.send({res:"OK",msg:"Destroyed cookies"})
    console.log("Logged out successfully");
    return
})


module.exports = admin_router