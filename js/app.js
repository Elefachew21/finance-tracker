// Load data from localStorage
let expense = JSON.parse(localStorage.getItem("expenses")) || [];
let income = JSON.parse(localStorage.getItem("income")) || [];

// DOM Elements
const entryForm = document.getElementById("entry-form");
const Name = document.getElementById("desc");
const Amount = document.getElementById("amount");
const transactionDate = document.getElementById("date");

const expenseAmount = document.getElementById("total-expense");
const incomeAmount = document.getElementById("total-income");
const netBalance = document.getElementById("net-balance");

const resultBody = document.querySelector(".result-body");
const allEntriesBtn = document.getElementById("all");
const expenseEntriesBtn = document.getElementById("expense");
const incomeEntriesBtn = document.getElementById("income");
// select search input button  for future use
const searchBtn = document.querySelector(".search-icon");
const searchInput = document.querySelector(".navbar input");

const expenseBtn = document.querySelector(".exp");
const incomeBtn = document.querySelector(".inc");
const category = document.getElementById("category");
let selectedType = "";


// Select Expense
expenseBtn.addEventListener("click", (e) => {
    e.preventDefault();

    selectedType = "expense";

    expenseBtn.classList.add("expense-active");
    incomeBtn.classList.remove("income-active");

    expenseBtn.style.backgroundColor = "red";
    incomeBtn.style.backgroundColor = "";
});

// Select Income
incomeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    selectedType = "income";

    incomeBtn.classList.add("income-active");
    expenseBtn.classList.remove("expense-active");

    incomeBtn.style.backgroundColor = "green";
    expenseBtn.style.backgroundColor = "";
});

// Calculate Totals
async function updateSummary() {
    const totalExpense = await expense.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const totalIncome = await income.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const balance = totalIncome - totalExpense;

    expenseAmount.textContent = `$${totalExpense.toFixed(2)}`;
    incomeAmount.textContent = `$${totalIncome.toFixed(2)}`;
    netBalance.textContent = `$${balance.toFixed(2)}`;
}

// Create Card
function createCard(entry) {
    const card = document.createElement("div");

    card.classList.add(
        entry.type === "expense"
            ? "expense-card"
            : "income-card"
    );

    card.innerHTML = `
        <div class="headCaption">
        ${entry.type==="expense" ? '<img src="/assets/icons/fallDown.jpg" />' : '<img src="/assets/icons/riseUp.jpg" />'}
         <div class="headCaptionText">
<p><strong>${entry.category}</strong></p>

            <div class="footCaption">
                <p>${entry.type}</p>
                <p>${entry.date}</p>
               <p style="display: none;">${entry.id}</p>
            </div>
         
        
        </div>

        <div style="color: ${entry.type === "expense" ? "red" : "lightgreen"};" class="${
            entry.type === "expense"
                ? "exp-card"
                : "inc-card"
        }">
            $${entry.amount}
        </div>
        <div class="action-btns">
        <img class="edit-btn" onclick="editEntry(this)" src="/assets/icons/edit.jpg" alt="Edit" />
             <img class="delete-btn" onclick="deleteEntry(this)" src="/assets/icons/delete.jpg" alt="Delete" />
        </div>
    `;

    resultBody.appendChild(card);
}


// Add Entry
function addEntry() {
    const description = Name.value.trim();
    const amount = Number(Amount.value);
    const date = transactionDate.value;
    const Category = category.value;
    // Validation
    if (!selectedType) {
        alert("Please select Expense or Income");
        return;
    }

    if (!description || !Category || amount <= 0 || !date) {
        alert("Please fill all fields correctly");
        return;
    }

    const entry = {
        id: Date.now(),
        description,
        amount,
        date,
        category: Category,
        type: selectedType,
    };

    if (selectedType === "expense") {
        expense.push(entry);
        localStorage.setItem(
            "expenses",
            JSON.stringify(expense)
        );
    } else {
        income.push(entry);
        localStorage.setItem(
            "income",
            JSON.stringify(income)
        );
    }

    createCard(entry);
    updateSummary();

    // Clear form
    Name.value = "";
    Amount.value = "";
    transactionDate.value = "";
    category.value = "";
}

// Submit Form
entryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addEntry();
});
// delete  entry
function deleteEntry(button) {
    const card=button.closest(".expense-card, .income-card");
    const ID = Number(card.querySelector(".footCaption p:nth-child(3)").textContent);
        const type = card.querySelector(".footCaption p:nth-child(1)").textContent;
    // Remove the entry from the respective array
    if (type === "expense" ) {
        expense = expense.filter((e) => e.id !== ID);
        localStorage.setItem("expenses", JSON.stringify(expense));
    } else {
        income = income.filter((i) => i.id !== ID);
        localStorage.setItem("income", JSON.stringify(income));
    }

    // Remove the card from the DOM
    card.remove();
          
    updateSummary();
}
function editEntry(button) {

    // view form back to the entry form
    document.getElementById("entry-form").scrollIntoView({ behavior: "smooth" });
    document.getElementById("submit-btn").textContent = "Update Entry";
    const card=button.closest(".expense-card, .income-card");
    const ID = Number(card.querySelector(".footCaption p:nth-child(3)").textContent);
    const type = card.querySelector(".footCaption p:nth-child(1)").textContent;
  
    // find the entry to edit
    let editEntry;
    if (type === "expense") {
        editEntry = expense.find((e) => e.id === ID);
        if (!editEntry) {
            alert("Entry not found!");
            return;
        }
    } else {
        editEntry = income.find((i) => i.id === ID);
        if (!editEntry) {
            alert("Entry not found!");
            return;
        }
    }

    // Populate form with existing data
    Name.value = editEntry.description;
    Amount.value = editEntry.amount;
    transactionDate.value = editEntry.date;
    category.value = editEntry.category;
    date.value = editEntry.date;
    selectedType = editEntry.type;
  

    if (selectedType === "expense") {
        expenseBtn.classList.add("expense-active");
        incomeBtn.classList.remove("income-active");
        expenseBtn.style.backgroundColor = "red";
        incomeBtn.style.backgroundColor = "";
    } else {
        incomeBtn.classList.add("income-active");
        expenseBtn.classList.remove("expense-active");
        incomeBtn.style.backgroundColor = "green";
        expenseBtn.style.backgroundColor = "";
    }
   
        editEntry.description = Name.value.trim();
        editEntry.amount = Number(Amount.value);
        editEntry.date = transactionDate.value;
        editEntry.category = category.value;
    editEntry.type = selectedType;
   
        document.getElementById("submit-btn").onclick = function() {
                    alert("Entry updated successfully!");
setTimeout(() => {
    location.reload();
            document.getElementById("submit-btn").textContent = "Add Entry";

}, 1000);
           
        };
  // Remove the old entry from the respective array
    if (type === "expense" ) {
        expense = expense.filter((e) => e.id !== ID);
        localStorage.setItem("expenses", JSON.stringify(expense));
    } else {
        income = income.filter((i) => i.id !== ID);
        localStorage.setItem("income", JSON.stringify(income));
    }
card.remove();
  
}
let filteredExpense;
let filteredIncome;
// filtering entries by category;
function filterExpenseEntries(expenseEntry) {
     filteredExpense = expense.filter((e) => e.type === category);
     
    return { filteredExpense };
    

}
// load all entries
allEntriesBtn.onclick = function() {
    resultBody.innerHTML = "";
    allEntriesBtn.style.backgroundColor = "#f3eb0968";
    expenseEntriesBtn.style.backgroundColor = "";
    expenseEntriesBtn.style.color = ""
        incomeEntriesBtn.style.color = ""
allEntriesBtn.style.color="white"
    incomeEntriesBtn.style.backgroundColor = "";
    renderEntries();
    
}
// load expense entries
expenseEntriesBtn.onclick = function () {
    resultBody.innerHTML = "";
    expenseEntriesBtn.style.backgroundColor = "rgba(255, 0, 0, 0.77)";
        expenseEntriesBtn.style.color = "rgba(248, 247, 247, 0.95)";
        incomeEntriesBtn.style.color = ""
    allEntriesBtn.style.color = ""

 incomeEntriesBtn.style.backgroundColor = "";
        allEntriesBtn.style.backgroundColor = "";
    expense.forEach(createCard);
}
//load income entries
incomeEntriesBtn.onclick = function () {

    resultBody.innerHTML = "";
    incomeEntriesBtn.style.backgroundColor = "rgba(0, 128, 0, 0.616)";
    expenseEntriesBtn.style.backgroundColor = "";
    allEntriesBtn.style.backgroundColor = "";
    expenseEntriesBtn.style.color = ""
        allEntriesBtn.style.color = ""
    incomeEntriesBtn.style.color = "white"
    income.forEach(createCard)
}
// Load Existing Entries
const renderEntries=async function() {
    updateSummary();
    expense.forEach(createCard);
    income.forEach(createCard);
}

renderEntries();
// search functionality for future use
searchBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (!searchInput.value.trim()) {
        alert("Fill the search input category or name you want");
        return;
    }

    const keyword = searchInput.value.trim().toLowerCase();

    const expenseResults = expense.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(keyword)
        )
    );

    const incomeResults = income.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(keyword)
        )
    );

    resultBody.innerHTML = "";

    if (expenseResults.length === 0 && incomeResults.length === 0) {
        const noResult = document.createElement("p");
        noResult.textContent = "No entries found.";
        resultBody.appendChild(noResult);
      
    } else {
          
        [...expenseResults, ...incomeResults].forEach(createCard);
          
    }

});