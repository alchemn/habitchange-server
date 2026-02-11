import {User} from '../generated/client'
import "express";

declare global {
    namespace Express {
        interface Request {
            user? : User & {iat?: number};
        }
    }
}

export {}