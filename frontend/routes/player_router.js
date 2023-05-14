const express = require("express")
const player_router = new express.Router()
const axios = require("axios")

player_router.post('/register',(req,res)=>{
    let {name,email,password} = req.body;
    email = email.trim();
    password = password.trim();
    name=name.trim();
    // send this data to backend and fetch it from axios and render/redirect accordingly
    axios.post('https://pirates-of-web-backend-ronin2810.onrender.com/register',{name:name,email:email,password:password})
    .then((response)=>{
        if (response.data.res=="OK") {
            req.session.user_id =  response.data.cookie.user_id
            req.session.email=response.data.cookie.email
            req.session.entity=response.data.cookie.entity
            req.session.isAuth=response.data.cookie.isAuth
            res.redirect('/player/dashboard')
        }
        else if (response.data.res=="AR"){
            res.render('login',{err:"You've Already Registered"})
        }
        else{
            res.render('register')
        }
    })
    .catch((err)=>{
        res.render('register')
    })
})
player_router.post('/player/login',(req,res)=>{
    let {email,password} = req.body;
    email = email.trim();
    password = password.trim();
    // send this data to backend and fetch it from axios and render/redirect accordingly
    axios.post('https://pirates-of-web-backend-ronin2810.onrender.com/player/login',{email:email,password:password})
    .then((response)=>{
        if (response.data.res=="OK") {
            req.session.user_id = response.data.cookie.user_id;
            req.session.email = response.data.cookie.email;
            req.session.entity= response.data.cookie.entity;
            req.session.isAuth= response.data.cookie.isAuth;
            console.log("player cookies set in frontend");
            res.redirect('/player/dashboard')
        }
        else if (response.data.res=="NO"){
            res.render('login',{err:"Wrong Credentials"})
        }
    })
    .catch((err)=>{
        res.render('login',{err:"Something Went Wrong"})
    })
})
player_router.get('/player/dashboard',(req,res)=>{
    // fetch response from axios and render/redirect accordingly
    // console.log("isauth in /player/dashboard in frontend",req.session.isAuth)
    console.log(req.session);
    axios.get('https://pirates-of-web-backend-ronin2810.onrender.com/player/dashboard',{params:{isAuth:req.session.isAuth,user_id:req.session.user_id,email:req.session.email,entity:req.session.entity}})
    .then((response)=>{
        if (response.data.res=="OK") {
            res.render('player_dashboard',{name:response.data.name})
        }
        else{
            res.redirect('/logout')
        }
    })
    .catch((err)=>{
        res.redirect('/logout')
    })
})

player_router.get('/player/riddle/restart',(req,res)=>{
    // fetch response from axios and render/redirect accordingly
    axios.get('https://pirates-of-web-backend-ronin2810.onrender.com/player/riddle/restart',{params:{isAuth:req.session.isAuth,user_id:req.session.user_id,email:req.session.email,entity:req.session.entity}})
    .then((response)=>{
        res.redirect('/player/riddle/q/1');
    })
    .catch((err)=>{
        res.redirect('/player/riddle/q/1');
    })
})

player_router.get('/player/riddle/continue',(req,res)=>{
    // fetch response from axios and render/redirect accordingly
    axios.get(`https://pirates-of-web-backend-ronin2810.onrender.com/player/riddle/continue`,{params:{isAuth:req.session.isAuth,user_id:req.session.user_id,email:req.session.email,entity:req.session.entity}})
    .then((response)=>{
        if (response.data.res=="OK") {
            res.render(`q${response.data.question}`,{msg:""})        
        }
        else{
            res.redirect('/logout')
        }
    })
    .catch((err)=>{
        res.redirect('/logout')
    })
    
})

player_router.get('/player/riddle/q/:id',(req,res)=>{
    // fetch response from axios and render/redirect accordingly
    const q_id = req.params['id']
    axios.get(`https://pirates-of-web-backend-ronin2810.onrender.com/player/riddle/q/${q_id}`,{params:{isAuth:req.session.isAuth,user_id:req.session.user_id,email:req.session.email,entity:req.session.entity}})
    .then((response)=>{
        if (response.data.res=="OK") {
            res.render(`q${response.data.question}`,{msg:""});
        }
        else if(response.data.res=="NO"){
            res.render(`q${response.data.question}`,{msg:"You can't go there yet"});
        }
        else if(response.data.res=="NO1"){
            res.render(`q${response.data.question}`,{msg:"Something went wrong Try Again"});
        }
        else{
            res.redirect('/logout')
        }
    })
    .catch((err)=>{
        res.redirect('/logout')
    })
})
player_router.post('/player/riddle/q/:id',(req,res)=>{
    const q_id = req.params['id']
    let {answer} = req.body;
    answer= answer.trim()
    // send this data to backend and fetch it from axios and render/redirect accordingly
    axios.post(`https://pirates-of-web-backend-ronin2810.onrender.com/player/riddle/q/${q_id}`,{answer:answer,isAuth:req.session.isAuth,user_id:req.session.user_id,email:req.session.email,entity:req.session.entity})
    .then((response)=>{
        if (response.data.res=="OK") {
            res.render(`q${response.data.question}`,{msg:response.data.msg});
        }
        else if(response.data.res=="DE"){
            res.render('deadend')
        }
        else if(response.data.res=="S"){
            res.render('success')
        }
        else if (response.data.res=="OK1"){
            res.render(`q${response.data.question}`,{msg:""})
        }
        else{
            res.redirect('/logout')
        }
    })
    .catch((err)=>{
        res.redirect('/logout')
    })
})

player_router.get('/logout',(req,res)=>{
    console.log("inside logout from player router");
    const data = {isAuth:true}
    axios.get('https://pirates-of-web-backend-ronin2810.onrender.com/logout',{params:data})
    .then((response)=>{
        console.log(response.data);
        res.clearCookie(process.env.COOKIE_NAME)
        req.session.destroy()
        res.render('login',{err:""})
    })
    .catch((err)=>{
        console.log(err.message);
    })
})

player_router.get('/login',(req,res)=>{
    console.log("inside login from player router");
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


module.exports = player_router
