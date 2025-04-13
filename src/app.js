import express from 'express';
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express();
app.use({
    origin:env.process.CORS_ORIGIN,
    ceredential:true
})
app.listen(express.json({
    limits:"16kb",
}))

app.use(express.static("public"))
app.use(cookieParser);

app.listen(express.urlencoded({
    extends:true,
    limits:"16kb"
}))
app.use(express.json())




export {app}