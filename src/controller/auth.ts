import prisma from '../utils/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {Request, Response} from 'express'
import { User } from '../types/user'

const JWT = process.env.JWT_SECRET as string


export async function register(req:Request, res: Response){
    try {
        const {email, password} = req.body as User
        const checkedUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(checkedUser){
            return res.status(400).json({message: "User already Register"})
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Email Must Be Valid"})
        }
        const hashPass = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashPass
            }
        })
        const token = jwt.sign({id:newUser.id, email: newUser.email}, JWT)
        res.status(200).json({message: "Register Success", data: {
            user: newUser,
            token
        }})
    } catch (error) {
     res.status(500).json({message: error})   
    }
}

export async function login(req:Request, res:Response){
    try {
        const {email,password} = req.body as User
        const findUser = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if(!findUser){
            return res.status(400).json({message: "User not found"})
        }
        const isMatch = await bcrypt.compare(password, findUser.password)
        if(!isMatch){
            return res.status(403).json({message: "Wrong Password"})
        }

        const token = jwt.sign({id:findUser.id, email: findUser.email},JWT)
        res.status(200).json({message:"Login Success", data:{
            user: findUser,
            token
        }})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error",error})
    }
}