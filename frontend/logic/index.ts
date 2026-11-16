import {FruitsStore} from "./fruits-store";

const loginButton = document.getElementById("login-button") as HTMLButtonElement;
loginButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("login button clicked");
    const loginForm = document.getElementById("div-login") as HTMLDivElement;
    loginForm.classList.remove("hidden");

})

const addForm = document.getElementById("add-form") as HTMLFormElement;
addForm.addEventListener("submit",async (e) => {
    e.preventDefault();
    await FruitsStore.addFruit()
})