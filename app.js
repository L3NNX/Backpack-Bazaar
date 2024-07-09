const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const cookieParser = require('cookie-parser')
const path = require('path')


require('dotenv').config()

const db=require("./config/mongoose_connection");

const ownersRouter = require("./routes/ownersRouters")
const productsRouter = require("./routes/productsRouters");
const userRouter = require("./routes/userRouters");
const indexRouter = require("./routes/index");

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/user",userRouter);
app.use("/owners", ownersRouter);
app.use("/products",productsRouter);

// app.get('/', (req, res) => {
//     res.send('<h1>Welcome to the homepage!</h1>')
//   })

app.listen(3000)