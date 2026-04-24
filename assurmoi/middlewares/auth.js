const jwt = require('jsonwebtoken')
require('dotenv').config()
const {User} = require('../models')
const user = require('../models/user')


const validationAuthentification = async(req,res,next)=>{
    const authorisationHeader = req.header('authorization')
    if (!authorisationHeader) return res.status(401).json({message: "No authorization header"});
    
    var token = authorisationHeader.split(" ")[1]
    if (!token) return res.status(401).json({message: "No token found"});

    jwt.verify(token,process.env.SECRET_KEY,async (err,decoded)=>{
        if(err) return res.status(401).json({message: "Wrong jwt token"});

        const user = await User.findOne({where: {token}})
        if (!user) return res.status(403).json({message: "Session expired"});

        // Vérifier que l'utilisateur est actif
        if (!user.active) return res.status(403).json({message: "User account is inactive"});

        if(Date.now() >= (decoded.exp * 1000)){
            user.token = null
            user.save()
            return res.status(403).json({message: "Token expired"})
        }
        req.user = user
        next()
    })
    
}
module.exports = {
    validationAuthentification
}