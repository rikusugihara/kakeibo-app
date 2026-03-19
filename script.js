const allBtn = document.getElementById("allBtn");
const monthBtn = document.getElementById("monthBtn");
const todayBtn = document.getElementById("todayBtn");

document.getElementById("allBtn").onclick = () => {
    filterType = "all";
    renderTransaction();
};

document.getElementById("monthBtn").onclick = () => {
    filterType = "month";
    renderTransaction();
};

document.getElementById("todayBtn").onclick = () => {
    filterType = "today";
    renderTransaction();
};

const ul = document.querySelector("ul");

const date = document.getElementById("date");
const category = document.getElementById("category");
const amount = document.getElementById("amount");

const addBtn = document.getElementById("addBtn");

const type = document.getElementById("type");

const total = document.getElementById("total");

const categoryTotal = document.getElementById("categoryTotal");

const ctx = document.getElementById("myChart").getContext("2d");


let transactions = [];

let filterType = "month";

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function getDisplayAmount(transaction) {
    if(transaction.inputType === "expense") {
        return -Math.abs(transaction.inputAmount);
    }
    return transaction.inputAmount;
}

function updateActiveButton() {
    allBtn.classList.remove("active");
    monthBtn.classList.remove("active");
    todayBtn.classList.remove("active");

    if(filterType === "all") {
        allBtn.classList.add("active");
    } else if(filterType === "month") {
        monthBtn.classList.add("active");
    } else if(filterType === "today") {
        todayBtn.classList.add("active");
    }
}

function renderTransaction() {
    updateActiveButton();
    categoryTotal.innerHTML = "";

    const today = new Date();

    const filtered = transactions.filter(transaction => {
        const txDate = new Date(transaction.inputDate);

        if(filterType === "month") {
            return (
                txDate.getFullYear() === today.getFullYear() &&
                txDate.getMonth() === today.getMonth()
            );
        }

        if(filterType === "today") {
            return (
                txDate.getFullYear() === today.getFullYear() &&
                txDate.getMonth() === today.getMonth() &&
                txDate.getDate() === today.getDate()
            );
        }

        return true;
    });

    const result = filtered.reduce((acc, transaction) => {
        const displayAmount = getDisplayAmount(transaction);

        if(!acc.categorySummary[transaction.inputCategory]) {
            acc.categorySummary[transaction.inputCategory] = 0;
        }

        acc.categorySummary[transaction.inputCategory] += displayAmount;

        acc.sum += displayAmount;

        return acc;
    }, {
        sum: 0,
        categorySummary: {}
    });

    ul.innerHTML = "";

    filtered.forEach((transaction, index) => {
        const li = document.createElement("li");

        let typeText;
        const displayAmount = getDisplayAmount(transaction);

        if(transaction.inputType === "expense") {
            li.classList.add("expense");
            typeText = "支出";
        } else {
            li.classList.add("income");
            typeText = "収入";
        }

        li.textContent = `${transaction.inputDate} ${typeText} ${transaction.inputCategory} ${displayAmount} `;

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "削除";
        removeBtn.addEventListener("click", function() {
            const realIndex = transactions.indexOf(transaction);
            transactions.splice(realIndex, 1);

            saveTransactions();
            renderTransaction();
        });

        li.appendChild(removeBtn);

        ul.appendChild(li);
    });

    total.textContent = `合計: ${result.sum}円`;

    Object.entries(result.categorySummary).forEach(([category, amount]) => {
        const div = document.createElement("div");
        div.textContent = `${category} ${amount}円`;

        categoryTotal.appendChild(div);
    })

    const labels = Object.keys(result.categorySummary);
    const data = Object.values(result.categorySummary).map(value => Math.abs(value));

    if(window.pieChart) {
        window.pieChart.destroy();
    }

    window.pieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [{
                data: data
            }]
        }
    });
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