const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const prisma = require("../prisma");
const { cookieExtractor } = require("../utils/cookieExtractor");

// Función para generar tokens JWT
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Obtener perfil del usuario
router.get("/", async (req, res) => {
  try {
    const token = cookieExtractor(req);
    const decoded = jwt.decode(token);

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.sub,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Crear un nuevo usuario
router.post("/", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        name: name,
      },
    });

    // Generar token JWT
    const token = generateToken(newUser.id);

    res.status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Editar perfil del usuario
router.put("/", async (req, res) => {
  try {
    const token = cookieExtractor(req);
    const decoded = jwt.decode(token);
    const userId = decoded.id;

    const { name } = req.body;

    // Actualizar el nombre del usuario
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: name,
      },
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
