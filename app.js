const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const path = require('path')
const flash = require("connect-flash")
const expressSession =  require('express-session') 


require('dotenv').config({ path: path.join(__dirname, '.env') })
const connectDB =require ("./config/mongoose_connection");

const ownersRouter = require("./routes/ownersRouters")
const productsRouter = require("./routes/productsRouters");
const userRouter = require("./routes/userRouters");
const indexRouter = require("./routes/index");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    expressSession({
        secret: process.env.JWT_KEY,
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash())
app.use((req, res, next) => {
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB error:", err.message);
    res.status(500).send("Database connection failed");
  }
});

app.use("/", indexRouter);
app.use("/user",userRouter);
app.use("/owners", ownersRouter);
app.use("/products",productsRouter);


const PORT = process.env.PORT
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB:", err.message);
  });

  module.exports = app;