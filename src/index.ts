import 'dotenv/config'
import express, {Request, Response} from 'express'
import authRouter from './route/auth'

const app = express()
const port = process.env.PORT

app.use(express.json())

app.get("/", (req:Request, res: Response) => {
    res.send("Hello World!")
})


app.use('/auth',authRouter)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))