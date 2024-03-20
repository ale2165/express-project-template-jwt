const express = require("express");
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRouter = require("./routes/auth");
const homeRouter = require("./routes/home");
const indexRouter = require("./routes/index");
const profileRouter = require("./routes/profile");

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Rutas
app.use("/auth", authRouter);
app.use("/home", homeRouter);
app.use("/index", indexRouter);
app.use("/profile", profileRouter);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Puerto de escucha
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
