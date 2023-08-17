const express = require('express')
const {Router} = express
const router = Router()
const bootcampController = require('./../controllers/bootcamp.controller.js')

const validaciones = require('./../middleware/index.js')
const emailValidations = validaciones.validateEmail
const tokenValidations = validaciones.validateToken

/* rutas */
router.post('/api/bootcamp', tokenValidations.verifyToken, async (request,response) =>{
    if(!request.body.title){
        return response.status(400).json({ success: false, message: 'Debe Indicar el Nombre del Bootcamp' })
    }
    if(!request.body.cue){
        return response.status(400).json({ success: false, message: 'Debe Indicar el Cue del Bootcamp' })
    }
    if(!request.body.description){
        return response.status(400).json({ success: false, message: 'Debe Indicar la Descripción del Bootcamp' })
    }
    try{
        const bootcamp = await bootcampController.createBootcamp(request.body)
        return response.json({ success:true, message: 'Bootcamp creada', data: bootcamp })
    }catch(err){
        return response.status(400).json({ success: false, message: 'No se pudo crear el Bootcamp' })
    }
})

router.post('/api/bootcamp/adduser', tokenValidations.verifyToken, async (request, response) =>{
    const {idBootcamp, idUser} = request.body
    const decodeTokenID = request.conectado
    /*validar que el usuario que se esta ingresado sea el logeado*/
    if(!idBootcamp){
        return response.status(400).json({ success: false, message: 'Debe Indicar el ID del Bootcamp' })
    }
    if(!idUser){
        return response.status(400).json({ success: false, message: 'Debe Indicar el ID del Usuario' })
    }
    if(idUser != decodeTokenID){
        return response.status(400).json({ success: false, message: 'No puedes Asignar a otros Usuarios a un Bootcamp' })
    }
    try{
        const matricula = await bootcampController.addUser(idBootcamp,idUser)
        return response.json({ success:true, message: 'matriculado', data: matricula })
    }catch(err){
        return response.status(400).json({ success: false, message: 'Error al Asingar un Usuario a un Bootcamp' })
    }
})

router.get('/api/bootcamp/:id', tokenValidations.verifyToken, async (request, response) =>{
    const idBootcamp = request.params.id
    const detalleBootcamp = await bootcampController.findById(idBootcamp)
    return response.json({ success: true, message: 'Bootcamp', data: detalleBootcamp })
})

router.get('/api/bootcamp', tokenValidations.verifyToken, async (request, response) =>{
    const detalleBootcamp = await bootcampController.findAll()
    return response.json({ success: true, message: 'Bootcamp', data: detalleBootcamp })
})


module.exports = router

