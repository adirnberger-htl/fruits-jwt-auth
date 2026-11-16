import {User} from "./store";
import {FruitsStore} from "./fruits-store";

const form = document.getElementById('login-form') as HTMLFormElement;
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await login()
})
const url = "http://localhost:3000"
async function login() {
    const email = document.getElementById("login-email") as HTMLInputElement;
    const password = document.getElementById("login-password") as HTMLInputElement;
    try {
        console.log(email.value)
        console.log(password.value);
        const response = await fetch(url + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value,
            })
        })
        const {userClaims, expiresAt, accessToken} = await response.json();
        if (!response.ok) {
            throw new Error("Login failed.");
        }
        User.name=userClaims.name;
        User.role=userClaims.role;
        sessionStorage.setItem("token", accessToken);
        const loginForm = document.getElementById("div-login") as HTMLDivElement;
        loginForm.classList.add("hidden");
        alert("You are logged in!");
        setupHead();
        if(User.role === 'admin') {
            const container = document.getElementById("add-container") as HTMLDivElement;
            container.classList.remove("hidden");
        }
        await FruitsStore.fetchFruits();
        FruitsStore.displayFruits();
    }catch(e){
        if(e instanceof Error) {
            alert(e.message);
        }
    }finally {
        email.value = "";
        password.value = "";
    }
}

function setupHead() {
    const head = document.getElementById("head-container") as HTMLDivElement;
    head.innerHTML="";
    const h1 = document.createElement("h1");
    h1.innerHTML= "Fruits";
    head.appendChild(h1);
    const div = document.createElement("div");
    div.classList.add("flex-column");
    const p = document.createElement("p");
    p.innerText= `Hallo ${User.name}! Status: ${User.role}`;
    const button = document.createElement("button");
    button.classList.add("logout-button");
    button.innerText= "Logout";
    button.addEventListener("click", () => {
        sessionStorage.removeItem("token");
        const loginForm = document.getElementById("div-login") as HTMLDivElement;
        loginForm.classList.remove("hidden");
        const add = document.getElementById("add-container") as HTMLDivElement;
        add.classList.add("hidden")
    });
    div.appendChild(p)
    div.appendChild(button)
    head.appendChild(div)
}