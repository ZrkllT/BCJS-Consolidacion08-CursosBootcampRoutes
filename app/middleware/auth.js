const secretKey = require('./../config/auth.config.js')
const jwt = require("node.jwt")

exports.encodeToken = (data) =>{
    const token = jwt.encode(data, secretKey)
    return token
}
/*
exports.verifyToken = (data) =>{
    const decodeToken = jwt.decode(data, secretKey)
    return decodeToken
}
*/
exports.verifyToken = (request, response, next) =>{
    const headToken = request.headers.authorization
    const decodeToken = jwt.decode(headToken, secretKey)

    if(request.url === '/api/signup' || request.url === '/api/signin' || request.url === '/api/bootcamp' ){
        next()
    }else{
        if(decodeToken.code !== '000'){
            return response.status(403).json({ success: false, message: 'Token Invalido' })
        }else{
            request.conectado = decodeToken.payload.id
            next()
        }
    }
}
