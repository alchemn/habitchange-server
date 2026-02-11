import jwt from 'jsonwebtoken'
import {Request, Response, NextFunction} from "express"
import prisma from '../utils/prisma'

const JWT = process.env.JWT_SECRET as string

interface DecodedToken {
    id: string
    email :string
    iat: number
}


export async function authMiddleware(req:Request, res: Response, next: NextFunction){
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]
        if (!token){
            return res.status(401).json({message: "Unauthorized"})
        
        }
    try {
        const decoded = jwt.verify(token, JWT) as DecodedToken
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id
            }
        })
        if(!user) {
            return res.status(401).json({message: "Unauthorized"})
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(401).json({message: "Token Invalid", error})
    }
}