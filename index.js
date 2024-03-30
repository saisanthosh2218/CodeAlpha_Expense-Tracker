let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;
let incomeBalance = parseFloat(localStorage.getItem("incomeBalance")) || 0;
let expenseBalance = parseFloat(localStorage.getItem("expenseBalance")) || -0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function updateBalances() {
  document.getElementById(
    "totalBalance"
  ).textContent = `$${totalBalance.toFixed(2)}`;
  document.getElementById(
    "incomeBalance"
  ).textContent = `$${incomeBalance.toFixed(2)}`;
  document.getElementById(
    "expenseBalance"
  ).textContent = `$${expenseBalance.toFixed(2)}`;
}

function updateLocalStorage() {
  localStorage.setItem("totalBalance", totalBalance.toFixed(2));
  localStorage.setItem("incomeBalance", incomeBalance.toFixed(2));
  localStorage.setItem("expenseBalance", expenseBalance.toFixed(2));
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function renderTransactions() {
  const transactionList = document.getElementById("transactionList");
  if (!transactionList) {
    console.error("Transaction list element not found.");
    return;
  }

  transactionList.innerHTML = `<p class="font-semibold text-center text-2xl mb-1">Transactions</p>`;
  transactions.forEach((transaction) => {
    const transactionItem = document.createElement("div");
    transactionItem.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <p class="font-semibold text-lg ">${
            transaction.name
          } <small style="color:gray;font-weight:100;font-size:12px">${
      transaction.date
    }</small></p>
        </div>
        <div>
          <p id="amount_${
            transaction.id
          }" class="font-semibold" style="color: ${
      transaction.type === "Expense" ? "red" : "green"
    }">${
      transaction.type === "Expense"
        ? "-$" + Math.abs(transaction.amount).toFixed(2)
        : "$" + (transaction.amount || 0).toFixed(2)
    }</p>
        </div>
        <div>
          <button style="background-Color:lightblue; font-weight:600; margin-top:2px; padding:2px; border-radius:3px; width:50px;" onclick="editTransaction(${
            transaction.id
          })">Edit</button>
          <button style="background-Color:#ff0000c4; font-weight:600; padding:2px; border-radius:3px; width:55px;" onclick="deleteTransaction(${
            transaction.id
          })">Delete</button>
        </div>
      </div>`;
    transactionList.appendChild(transactionItem);
  });
}

function editTransaction(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  const newName = prompt("Enter new name:", transaction.name);
  const newDate = prompt("Enter new date:", transaction.date);
  const newAmount = parseFloat(prompt("Enter new amount:", transaction.amount));

  if (newName !== null && newDate !== null && !isNaN(newAmount)) {
    transaction.name = newName;
    transaction.date = newDate;
    transaction.amount = newAmount;

    // Update balances
    if (transaction.type === "Expense") {
      totalBalance -= transaction.amount;
      expenseBalance -= transaction.amount;
    } else {
      totalBalance += transaction.amount;
      incomeBalance += transaction.amount;
    }

    // Update the transaction amount displayed
    const amountElement = document.getElementById(`amount_${id}`);
    if (amountElement) {
      amountElement.textContent =
        transaction.type === "Expense"
          ? "-$" + Math.abs(transaction.amount).toFixed(2)
          : "$" + transaction.amount.toFixed(2);
    }

    updateBalances();
    updateLocalStorage();
  }
}

function addExpense() {
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const amount = parseFloat(document.getElementById("amt").value);

  totalBalance -= amount;
  expenseBalance -= amount;

  transactions.push({
    id: Date.now(),
    name,
    date,
    amount: -amount,
    type: "Expense",
  });

  if (!name || !date || isNaN(amount) || amount <= 0) {
    alert("Please fill in all fields and provide a valid amount.");
    return;
  }

  updateBalances();
  updateLocalStorage();
  renderTransactions();
}

function addIncome() {
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const amount = parseFloat(document.getElementById("amt").value);

  totalBalance += amount;
  incomeBalance += amount;

  transactions.push({ id: Date.now(), name, date, amount, type: "Income" });

  if (!name || !date || isNaN(amount) || amount <= 0) {
    alert("Please fill in all fields and provide a valid amount.");
    return;
  }

  updateBalances();
  updateLocalStorage();
  renderTransactions();
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  // Recalculate balances based on remaining transactions
  totalBalance = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );
  incomeBalance = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((total, transaction) => total + transaction.amount, 0);
  expenseBalance = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((total, transaction) => total + transaction.amount, 0);

  updateBalances();
  updateLocalStorage();
  renderTransactions();
}

// Initial balance update
updateBalances();
renderTransactions();
