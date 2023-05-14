const db = require('../db/conn')
const bcrypt = require('bcrypt')

const login  = async(req,res,next)=>{
    const email = req.body.email;
    const password = req.body.password;

    console.log("Received:",email);
    console.log("Received:",password);
    try {
        await db.promise().query(`select * from admin where admin_email='${email}';`)
        .then((data)=>{
            let admin = data[0][0]
            if (admin === undefined) {
                req.session.isAuth = false
                console.log("sending NO for login");
                const cookie = {isAuth:false}
                res.send({res:"NO",cookie:cookie})
                return
            }
            
            bcrypt.compare(password, admin.admin_password)
            .then(async (auth) => {
                    if (auth) {
                        req.session.email = admin.admin_email
                        req.session.entity = 'admin'
                        req.session.isAuth = true
                        next()
                        return
                    }
                    else {
                        req.session.isAuth = false
                        console.log("sending NO for login");
                        const cookie = {isAuth:false}
                        res.send({res:"NO",cookie:cookie})
                    }
                })
                .catch((err) => {
                    req.session.isAuth = false
                    console.log("sending NO for login");
                    const cookie = {isAuth:false}
                    res.send({res:"NO",cookie:cookie})
                })
            
        }) 
        .catch((err)=>{
            console.log(err);
            req.session.isAuth = false;
            console.log("sending NO for login");
            const cookie = {isAuth:false}
            res.send({res:"NO",cookie:cookie})
        })       
    } catch (error) {
        console.log(error);
        console.log("sending NO for login");
        const cookie = {isAuth:false}
        res.send({res:"NO",cookie:cookie})
        return
    }
}

const isAuth = (req, res, next) => {
    console.log("inside player controller isAuth");
    // console.log(req);
    console.log(req.query.isAuth);
    req.session.isAuth = req.query.isAuth;
    console.log("After login isauth in isAuth: ",req.session.isAuth);
    console.log(req.body.isAuth);
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


module.exports = {login,isAuth}