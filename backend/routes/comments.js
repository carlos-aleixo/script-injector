const express = require("express");
const router = express.Router();
const db = require("../data/database");

// Enviar comentário
router.post("/add", (req, res) => {
    const { comment } = req.body;
    if (comment) {
        console.log(comment)
        db.comments.push(comment); // Armazena o comentário sem sanitização (simulando vulnerabilidade)
        res.status(200).json({ message: "Comentário enviado!" });
    } else {
        res.status(400).json({ message: "Comentário inválido!" });
    }
});

// Obter todos os comentários
router.get("/", (req, res) => {
    console.log(db.comments)
    res.status(200).json({ comments: db.comments });
});

module.exports = router;