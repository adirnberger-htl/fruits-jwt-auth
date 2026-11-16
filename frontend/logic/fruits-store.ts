import type {Fruit, FruitsDB} from "./types"
import {StatusCodes} from "http-status-codes"
export class FruitsStore {
    private static url: string = "http://localhost:3000/api";
    private static fruits: FruitsDB[] = [];

    public static async fetchFruits() {
        try {
            const response = await fetch(this.url + "/fruits", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                }
            });
            const result: FruitsDB[] = await response.json();
            if(!response.ok) throw new Error("Fruits not found");
            this.fruits = result;
        }catch (e) {
            if(e instanceof Error) {
                alert(e.message);
            }
        }
    }

    public static displayFruits() {
        const table = document.getElementById("fruits-table") as HTMLTableElement;
        table.innerHTML = "";
        const headers: string[] = ["Name", "Stück", "Preis", "Löschen"]
        const tr: HTMLTableRowElement = document.createElement("tr");
        headers.forEach(h => {
            const td: HTMLTableCellElement = document.createElement("td");
            td.textContent=h;
            tr.appendChild(td);
        })
        table.appendChild(tr);
        this.fruits.forEach(fruit => {
            const tr: HTMLTableRowElement = document.createElement("tr");
            const name: HTMLTableCellElement = document.createElement("td");
            const stock: HTMLTableCellElement = document.createElement("td");
            const price: HTMLTableCellElement = document.createElement("td");
            const buttonCell: HTMLTableCellElement = document.createElement("td");
            const button: HTMLButtonElement = document.createElement("button");
            name.textContent = fruit.name;
            stock.textContent = fruit.stock.toString() + " Stk."
            price.textContent = fruit.price.toString();
            buttonCell.appendChild(button);
            button.classList.add("logout-button")
            button.textContent = "Löschen";
            button.addEventListener("click", async () => {
                await this.deleteFruit(fruit.id)
            })
            tr.appendChild(name);
            tr.appendChild(stock);
            tr.appendChild(price);
            tr.appendChild(buttonCell);
            table.appendChild(tr);
        })
    }

    private static async deleteFruit(id: number) {
        try {
            const response = await fetch(this.url + "/fruits/" + id.toString(), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                }
            });
            const result: {message: string} = await response.json();
            if(!response.ok) throw new Error("Error while deleting fruit");
            this.fruits = this.fruits.filter(f => f.id !== id);
            this.displayFruits();
            alert(result.message)
        }catch (e) {
            if(e instanceof Error) {
                alert(e.message);
            }
        }
    }

    public static async addFruit() {
        const name: HTMLInputElement = document.getElementById("name-fruit") as HTMLInputElement;
        const stock: HTMLInputElement = document.getElementById("stock-fruit") as HTMLInputElement;
        const price: HTMLInputElement = document.getElementById("price-fruit") as HTMLInputElement;
        try {
            const fruit: Fruit ={
                name: name.value,
                stock: Number(stock.value),
                price: Number(price.value)
            }
            const response = await fetch(this.url + "/fruits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
                body: JSON.stringify(fruit),
            });
            const result: {message:string} = await response.json();
            if(response.status !== StatusCodes.CREATED) throw new Error(result.message);
            alert("Fruit is created successfully");
            await this.fetchFruits();
            this.displayFruits();
        }catch (e) {
            if(e instanceof Error) {
                alert(e.message);
            }
        }finally {
            name.value = "";
            stock.value = "";
            price.value = "";
        }
    }
}