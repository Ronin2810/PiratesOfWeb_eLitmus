const express = require('express')
const player_router = new express.Router()
const controller = require('../controller/player_controller')
const db = require('../db/conn')


player_router.post('/register',controller.register,async(req,res)=>{
    if (req.session.isAuth) {
        // res.redirect('/player/dashboard')
        const cookie = {
            user_id:req.session.user_id,
            email:req.session.email,
            entity:req.session.entity,
            isAuth:req.session.isAuth
        }
        res.send({
            res:"OK",
            cookie:cookie
        })
    }
    else if (req.session.alreadyRegistered){
        
        res.send({res:"AR"})
        // res.render('login')
    }
    else{
        // res.render('register')
        res.send({res:"NO"})
    }
})

player_router.post('/player/login',controller.login,async(req,res)=>{
    if (req.session.isAuth) {
        // res.redirect('/player/dashboard')
        //send cookies here
        const cookie = {
            user_id:req.session.user_id,
            email:req.session.email,
            entity:req.session.entity,
            isAuth:req.session.isAuth
        }
        console.log(cookie,"cookie sent from backend to frontend");
        res.send({res:"OK",cookie:cookie})
    }
    else{
        // res.render('login')
        console.log("Sending NO for login");
        res.send({res:"NO"})
    }
})


player_router.get('/player/dashboard',controller.isAuth,async(req,res)=>{
    try {
        const user_id = req.query.user_id;
        const email = req.query.email;
        const entity = req.query.entity;

        req.session.user_id=user_id;
        req.session.email = email;
        req.session.entity = entity;
        req.session.isAuth = true;

        // console.log("session var email: ",req.session.email);
        await db.promise().query(`select * from users where user_email='${req.session.email}';`)
        .then((data)=>{
            const user = data[0][0];
            console.log(user);
            const name  = user.user_name;
            console.log(name);
            console.log(req.session.user_id);
            // res.render('player_dashboard',{name:name})
            res.send({res:"OK",name:name})
        })
        .catch((err)=>{
            console.log(err);
            // res.redirect('/logout')
            res.send({res:"NO"})
        })
        
    } catch (error) {
        console.log(error);
        res.send({res:"NO"})
        // res.redirect('/logout')

    }
})



player_router.get('/player/riddle/restart',controller.isAuth,controller.restart,async(req,res)=>{
    const user_id = req.query.user_id;
    const email = req.query.email;
    const entity = req.query.entity;

    req.session.user_id=user_id;
    req.session.email = email;
    req.session.entity = entity;
    req.session.isAuth = true;
    // res.redirect('/player/riddle/q/1');
    res.send({res:"OK"})
})

player_router.get('/player/riddle/continue',controller.isAuth,async(req,res)=>{
    const user_id1 = req.query.user_id;
    const email = req.query.email;
    const entity = req.query.entity;

    req.session.user_id=user_id1;
    req.session.email = email;
    req.session.entity = entity;
    req.session.isAuth = true;


    const user_id = req.session.user_id;
    await db.promise().query(`select * from user_status where user_id=${user_id}`)
    .then((data)=>{
        const qno = data[0][0].question_no;
        console.log(qno);
        // res.redirect(`/player/riddle/q/${qno}`)
        res.send({res:"OK",question:qno})
    })
    .catch((err)=>{
        console.log(err);
    })
})

player_router.get('/player/riddle/q/:id',controller.isAuth,async(req,res)=>{
    const user_id = req.query.user_id;
    const email = req.query.email;
    const entity = req.query.entity;

    req.session.user_id=user_id;
    req.session.email = email;
    req.session.entity = entity;
    req.session.isAuth = true;
    
    
    
    const qno = req.params['id'];

    await db.promise().query(`select * from user_status where user_id=${req.session.user_id};`)
    .then(async(data)=>{
        data = data[0][0].question_no;
        if(qno<=data){
            await db.promise().query(`update user_status set question_no=${qno} where user_id = ${req.session.user_id};`)
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err);
            })
            // res.render(`q${qno}`,{msg:""});
            res.send({res:"OK",question:qno})
        }
        else{
            // await db.promise().query(`update user_status set question_no=${data} where user_id = ${req.session.user_id};`)
            // .then((data)=>{
            //     console.log(data);
            // })
            // .catch((err)=>{
            //     console.log(err);
            // })
            // res.render(`q${data}`,{msg:""});
            res.send({res:"NO",question:data})
        }
    })
    .catch(async(err)=>{
        console.log(err);
        res.send({res:"NO1",question:data})
        // res.render(`q${data}`,{msg:""});
    })
})

player_router.post('/player/riddle/q/:id',controller.isAuth,async(req,res)=>{
    const user_id = req.body.user_id;
    const email = req.body.email;
    const entity = req.body.entity;

    req.session.user_id=user_id;
    req.session.email = email;
    req.session.entity = entity;
    req.session.isAuth = true;
    
    const q_id = req.params['id']
    let {answer} = req.body;
    answer = answer.toLowerCase();
    await db.promise().query(`select * from questions where question_no=${q_id} and answer = '${answer}';`)
    .then(async(data)=>{
        if(data[0].length===0){
            // res.render(`q${q_id}`,{msg:"Wrong Answer!"});
            res.send({res:"OK",question:q_id,msg:"Wrong Answer!"})
            return
        }
        const next_question = data[0][0].next_question;
        await db.promise().query(`update user_status set question_no=${next_question} where user_id = ${req.session.user_id};`)
        .then((data)=>{
            console.log(data);
        })
        .catch((err)=>{
            console.log(err);
        })
        if(next_question===-1){
            await db.promise().query(`update user_status set question_no=${q_id} where user_id = ${req.session.user_id};`)
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err);
            })
            // res.render('deadend')
            res.send({res:"DE"})
        }
        else if(next_question===-2){
            await db.promise().query(`update user_status set question_no=1 where user_id = ${req.session.user_id};`)
            .then((data)=>{
                console.log(data);
            })
            .catch((err)=>{
                console.log(err);
            })
            // res.render('success')
            res.send({res:"S"})
        }
        else{
            // res.render(`q${next_question}`,{msg:""})
            res.send({res:"OK1",question:next_question})
        }
    })
    .catch((err)=>{
        console.log(err);
    })
})


player_router.get('/logout',controller.isAuth,async(req,res)=>{
    res.clearCookie(process.env.COOKIE_NAME)
    req.session.destroy()
    // res.redirect("/login")
    res.send({res:"OK",msg:"Destroyed cookies"})
    console.log("Logged out successfully");
    return
})

module.exports = player_router