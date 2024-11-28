const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const token = req.cookies.sessionToken || req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token não fornecido" });

    jwt.verify(token, "minha-chave-secreta-super-segura", (err, user) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;