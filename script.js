const ul = document.querySelector("ul");

const date = document.getElementById("date");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const addBtn = document.getElementById("addBtn");

const type = document.getElementById("type");

const total = document.getElementById("total");

const categoryTotal = document.getElementById("categoryTotal");


let transactions = [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransaction() {
    ul.innerHTML = "";

    categoryTotal.innerHTML = "";

    let categorySummary = {};

    let sum = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement("li");

        let typeText;
        let displayAmount;
        if(transaction.inputType === "expense") {
            li.classList.add("expense");
            displayAmount = -Math.abs(transaction.inputAmount);
            typeText = "支出";
        } else {
            li.classList.add("income");
            displayAmount = transaction.inputAmount;
            typeText = "収入";
        }

        li.textContent = `${transaction.inputDate} ${typeText} ${transaction.inputCategory} ${displayAmount} `;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "削除";
        removeBtn.addEventListener("click", function() {
            transactions.splice(index, 1);

            saveTransactions();
            renderTransaction();
        });

        if(!categorySummary[transaction.inputCategory]) {
            categorySummary[transaction.inputCategory] = 0;
        }

        categorySummary[transaction.inputCategory] += displayAmount;

        sum += displayAmount;

        li.appendChild(removeBtn);

        ul.appendChild(li);
    });

    total.textContent = `合計: ${sum}円`;

    Object.entries(categorySummary).forEach(([category, amount]) => {
        const div = document.createElement("div");
        div.textContent = `${category} ${amount}円`;

        categoryTotal.appendChild(div);
    })
}

addBtn.addEventListener("click", function() {
    const inputDate = date.value;
    const inputCategory = category.value;
    const inputAmount = Number(amount.value);
    const inputType = type.value;

    if(inputDate === "" || inputCategory === "") {
        return;
    }

    transactions.push({inputDate, inputCategory, inputAmount, inputType});

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