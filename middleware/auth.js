const jwt=require('jsonwebtoken');
const config=require('config');

// middleware fucntion
// request response and next which passes control to the next middleware
function auth(req,res,next){
    const token=req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied. No token provided');

    try{
        const decoded=jwt.verify(token,config.get('jwtPrivateKey'));
        req.user=decoded;
        //passes control to the next middleware
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

module.exports=auth;