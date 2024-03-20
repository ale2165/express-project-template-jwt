const express = require('express');
const app = express();
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');


dotenv.config();

app.use(cors());
app.use(express.json());


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerifyStrategy = new Strategy(jwtOptions, async (payload, done) => {
  const user = await prisma.user.findUnique({ where: { id: payload.id } });
  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});

passport.use(jwtVerifyStrategy);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});