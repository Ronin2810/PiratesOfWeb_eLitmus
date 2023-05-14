const db = require('../db/conn')
const bcrypt = require('bcrypt')
const express= require('express')
const router = express.Router()

const register = async (req,res,next)=>{
    const email = req.body.email;
    const name = req.body.name;
    // console.log(name,email);
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt)

    try {
        await db.promise().query(`select * from users where user_email = '${email}';`)
        .then((data)=>{
            console.log(data[0]);
            if (data[0].length!=0) {
                req.session.isAuth = false
                req.session.alreadyRegistered = true
                console.log("Returned");
                next()
                return
            }
        })
        .catch((err)=>{
            console.log(err);
            return
        })
    } catch (error) {
        console.log(error);
        return
    }

    if (!req.session.alreadyRegistered) {
        try {
            await db.promise().query(`insert into users(user_name,user_email,user_password) values ('${name}','${email}','${password}');`)
            .then(async(data)=>{
                // console.log(data[0]);
                req.session.user_id = data[0]['insertId']
                req.session.email = email
                req.session.entity = "player"
                req.session.isAuth = true
    
                await db.promise().query(`insert into user_status values (${req.session.user_id},1);`)
                .then((data)=>{
                    console.log(data);
                })
                .catch((err)=>{
                    console.log(err);
                })
                next()
                return
            })
            .catch((err)=>{
                console.log(err);
            })
        } catch (error) {
            console.log(error);
        }
    }
    next()
}


const login  = async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;
    try {
        await db.promise().query(`select * from users where user_email='${email}';`)
        .then((data)=>{
            let user = data[0][0]
            // console.log("Fetched user in backend",user);
            if (user === undefined) {
                req.session.isAuth = false
                console.log("sending NO for login");
                res.send({res:"NO"})
                return
            }
            
            bcrypt.compare(password, user.user_password)
            .then(async (auth) => {
                    if (auth) {
                        // console.log("password correct in backend");
                        req.session.user_id = user.user_id
                        req.session.email = user.user_email
                        req.session.entity = 'player'
                        req.session.isAuth = true
                        // console.log("player cookies set in backend");
                        // console.log("Session var email: backend ",req.session.email);
                        next()
                    }
                    else {
                        req.session.isAuth = false
                        console.log("Sending NO for login");
                        res.send({res:"NO"})
                    }
                })
                .catch((err) => {
                    req.session.isAuth = false
                    console.log("Sending NO for login");
                    res.send({res:"NO"})
                })
            
        }) 
        .catch((err)=>{
            console.log(err);
            req.session.isAuth = false;
            console.log("Sending NO for login");
            res.send({res:"NO"})
        })       
    } catch (error) {
        console.log(error);
        return
    }
}



const isAuth = (req, res, next) => {
    req.session.isAuth = req.query.isAuth;
    if (req.query.isAuth===undefined) {
        req.session.isAuth = req.body.isAuth;
    }
    // console.log("After login isauth in isAuth: ",req.session.isAuth);
    console.log("from isAuth backend",req.query.isAuth);
    if (req.session.isAuth) {
        req.session.isAuth=true
        next()
    }
    else {
        // res.render("login")
        console.log("sending no from isAuth");
        res.send({res:"NO"})
    }
}


const restart = async(req,res,next)=>{
    const user_id = req.query.user_id;
    const email = req.query.email;
    const entity = req.query.entity;

    req.session.user_id=user_id;
    req.session.email = email;
    req.session.entity = entity;
    req.session.isAuth = true;
    await db.promise().query(`update user_status set question_no=1 where user_id=${req.session.user_id};`)
    .then((data)=>{
        console.log(data[0]);
    })  
    .catch((err)=>{
        console.log(err);
    })  
    next()
}

module.exports = {register,isAuth,login,restart,router}