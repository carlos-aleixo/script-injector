// URLs do backend
const API_URL = "http://localhost:3000";
const LOGIN_URL = `${API_URL}/auth/login`;
const LOGOUT_URL = `${API_URL}/auth/logout`;
const COMMENTS_URL = `${API_URL}/comments`;

// Função para definir um cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

// Função para obter todos os cookies como objeto
function getCookies() {
    return document.cookie
        .split("; ")
        .reduce((cookies, item) => {
            const [key, value] = item.split("=");
            cookies[key] = value;
            return cookies;
        }, {});
}

// Função para deletar um cookie
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

// Atualizar o login para criar cookies
document.getElementById("loginForm").onsubmit = async function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
        const data = await response.json();

        // Salva o token no localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);

        // Define cookies diretamente no navegador
        setCookie("username", username, 1); // Expira em 1 dia
        setCookie("loginDate", new Date().toISOString(), 1); // Expira em 1 dia

        // Atualiza a interface
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("commentsSection").style.display = "block";
        document.getElementById("user").innerText = username;
        loadComments();
    } else {
        alert("Login falhou! Verifique suas credenciais.");
    }
};

async function loadComments() {
    const token = localStorage.getItem("token");

    const response = await fetch(COMMENTS_URL, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });

    if (response.ok) {
        const data = await response.json();
        const commentsDiv = document.getElementById("comments");
        commentsDiv.innerHTML = ""; // Limpa os comentários existentes

        // Adiciona cada comentário como um novo elemento separado
        data.comments.forEach((comment) => {
            const commentCard = document.createElement("div");
            commentCard.className = "comment-card";
            commentCard.textContent = comment; // Exibe o comentário em uma nova linha
            commentsDiv.appendChild(commentCard);
        });
    } else {
        alert("Erro ao carregar comentários.");
    }
}

async function submitComment() {
    const token = localStorage.getItem("token");
    const comment = document.getElementById("comment").value;

    if (comment.trim() === "") {
        alert("O comentário não pode estar vazio!");
        return;
    }

    const response = await fetch(`${COMMENTS_URL}/add`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment }),
    });

    if (response.ok) {
        document.getElementById("comment").value = ""; // Limpa o campo de entrada
        loadComments(); // Atualiza a lista de comentários
    } else {
        alert("Erro ao enviar comentário.");
    }
}

// Atualizar logout para deletar cookies
async function logout() {
    const token = localStorage.getItem("token");

    // Solicita ao backend que limpe o cookie do token
    await fetch(LOGOUT_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
    });

    // Limpa o localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Deleta cookies
    deleteCookie("username");
    deleteCookie("loginDate");

    // Atualiza a interface
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("commentsSection").style.display = "none";
    document.getElementById("user").innerText = "Visitante";
}
