const ul = document.querySelector("ul");

const date = document.getElementById("date");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const addBtn = document.getElementById("addBtn");

const total = document.getElementById("total");


let transactions = [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransaction() {
    ul.innerHTML = "";

    let sum = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");
        li.textContent = `${transaction.inputDate} ${transaction.inputCategory} ${transaction.inputAmount}`;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "削除";
        removeBtn.addEventListener("click", function() {
            transactions.splice(index, 1);

            saveTransactions();
            renderTransaction();
        });

        sum += transaction.inputAmount;

        li.appendChild(removeBtn);

        ul.appendChild(li);
    });

    total.textContent = `合計: ${sum}円`;
}

addBtn.addEventListener("click", function() {
    const inputDate = date.value;
    const inputCategory = category.value;
    const inputAmount = Number(amount.value);

    if(inputDate === "" || inputCategory === "") {
        return;
    }

    transactions.push({inputDate, inputCategory, inputAmount});

    saveTransactions();
    renderTransaction();

    date.value = "";
    category.value = "";
    amount.value = "";
});

const saved = localStorage.getItem("transactions");

if(saved !== null) {
    transactions = JSON.parse(saved);
}

renderTransaction();