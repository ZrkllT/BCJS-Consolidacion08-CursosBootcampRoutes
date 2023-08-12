const express = require('express')
const {Router} = express
const router = Router()
const userController = require('./../controllers/user.controller.js')

const validaciones = require('./../middleware/index.js')
const emailValidations = validaciones.validateEmail
const tokenValidations = validaciones.validateToken

let decodeTokenID
/* middleware */
router.use((request, response, next) =>{
    const headToken = request.headers.authorization
    const decodeToken = tokenValidations.decodeToken(headToken)
    if(request.url === '/api/signup' || request.url === '/api/signin' ){
        next()
    }else{
        if(decodeToken.code !== '000'){
            return response.status(403).json({ success: false, message: 'Token invalido' })
        }else{
            decodeTokenID = decodeToken.payload.id
            next()
        }
    }
})

/* rutas */
router.post('/api/signup', async (request, response) =>{
    /* validacion cuerpo */
    if(!request.body.firstName){
        return response.status(400).json({ success: false, message: 'Debe Indicar el Nombre del Usuario' })
    }
    if(!request.body.lastName){
        return response.status(400).json({ success: false, message: 'Debe Indicar el Apellido del Usuario' })
    }
    if(!request.body.email){
        return response.status(400).json({ success: false, message: 'Debe Indicar el Correo del Usuario' })
    }else{
        const validEmail = await emailValidations.validateEmail(request.body.email)
        if(validEmail){
            return response.status(400).json({ success: false, message: 'El correo indicado ya esta en uso' })
        }
    }
    if(!request.body.password){
        return response.status(400).json({ success: false, message: 'Debe Indicar una contraseña para el Usuario' })
    }else if(request.body.password.length < 8){
        return response.status(400).json({ success: false, message: 'El password debe tener al menos 8 caracteres' })
    }

    try{
        const usuario = await userController.createUser(request.body)
        return response.json({ success:true, data: usuario})
    }catch(err){
        return response.status(1).json({ success: false, message: 'as', data: err })
    }
    
})

router.post('/api/signin', async (request, response) =>{
    try{
        const token = await userController.loginUser(request.body)
        return response.json({ success: true, message: 'Usuario Encontrado', data: token })
    }catch(err){
        return response.status(404).json({ success: false, message: err })
    }
})

/*t*/
router.get('/api/user/:id', async (request, response) =>{
    const idUser = request.params.id
    const wantedUser = await userController.findUserById(idUser)
    return response.json({ success: true, message: 'Usuario Encontrado', data: wantedUser })
})

/*t*/
router.get('/api/user', async(request, response) =>{
    const wantedUSers = await userController.findAll()
    return response.json({ success: true, message: 'Listado de Usuarios', data: wantedUSers })
})

/*t*/
router.put('/api/user/:id', async (request, response) =>{
    const idUser = request.params.id
    if(Number(idUser) !== Number(decodeTokenID)){
        return response.status(400).json({ success: false, message: 'Solo puede editar SU información' })
    }
    const {firstName, lastName} = request.body
    if(!firstName && !lastName){
        return response.status(400).json({ success: false, message: 'Debe Indicar Nombre o Apellido a actualizar' })
    }
    const updatedUser = await userController.updateUserById( idUser,firstName,lastName )
    return response.json({ success: true, message: 'Usuario Actualizado' })
})
/*t*/
//router.delete('/api/user/:id')


module.exports = router


