const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../data/database");

const SECRET_KEY = "minha-chave-secreta-super-segura";

router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        // Gera um token com dados do usuário
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

        // Salva o token na "sessão" (simulação)
        db.users[username] = { username, token };

        // Define o cookie do token (HTTP-only em produção)
        res.cookie("sessionToken", token, { httpOnly: false });

        res.status(200).json({ message: "Login bem-sucedido!", token });
    } else {
        res.status(400).json({ message: "Usuário ou senha inválidos!" });
    }
});

// Rota de logout
router.post("/logout", (req, res) => {
    res.clearCookie("sessionToken");
    res.status(200).json({ message: "Logout bem-sucedido!" });
});

module.exports = router;