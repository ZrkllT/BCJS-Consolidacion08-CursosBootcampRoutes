const secretKey = require('./../config/auth.config.js')
const jwt = require("node.jwt")

exports.encodeToken = (data) =>{
    const token = jwt.encode(data, secretKey)
    return token
}

exports.verifyToken = (data) =>{
    const decodeToken = jwt.decode(data, secretKey)
    return decodeToken
}

/*
exports.verifyToken = (request, response, next) =>{
    const headToken = request.headers.authorization
    const dataUser = jwt.decode(headToken, secretKey)

    if(dataUser !== '000'){
        return response.status(403).json({success: false, message: "Token inválido"})
    }
    request.conectado = dataUser.payload
    next()
}
*/