const entryList = document.getElementById('entryList');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const netBalance = document.getElementById('netBalance');
const addEntryButton = document.getElementById('addEntry');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const filterRadios = document.getElementsByName('filter');

let entries = JSON.parse(localStorage.getItem('entries')) || [];

function updateLocalStorage() {
    localStorage.setItem('entries', JSON.stringify(entries));
}

function renderEntries(filter = 'all') {
    entryList.innerHTML = '';
    let filteredEntries = entries;

    if (filter === 'income') {
        filteredEntries = entries.filter(entry => entry.type === 'income');
    } else if (filter === 'expense') {
        filteredEntries = entries.filter(entry => entry.type === 'expense');
    }

    filteredEntries.forEach((entry, index) => {
        const li = document.createElement('li');
        li.innerHTML = `${entry.description} - ₹${entry.amount} 
            <button onclick="editEntry(${index})">Edit</button>
            <button onclick="deleteEntry(${index})">Delete</button>`;
        entryList.appendChild(li);
    });

    calculateTotals();
}

function calculateTotals() {
    const totalInc = entries.filter(entry => entry.type === 'income').reduce((acc, entry) => acc + Number(entry.amount), 0);
    const totalExp = entries.filter(entry => entry.type === 'expense').reduce((acc, entry) => acc + Number(entry.amount), 0);
    totalIncome.textContent = totalInc;
    totalExpenses.textContent = totalExp;
    netBalance.textContent = totalInc - totalExp;
}

function addEntry() {
    const description = descriptionInput.value;
    const amount = amountInput.value;
    const type = document.querySelector('input[name="type"]:checked').value;

    if (description && amount) {
        entries.push({ description, amount, type });
        updateLocalStorage();
        renderEntries();
        descriptionInput.value = '';
        amountInput.value = '';
    }
}

function editEntry(index) {
    const entry = entries[index];
    descriptionInput.value = entry.description;
    amountInput.value = entry.amount;
    document.querySelector(`input[name="type"][value="${entry.type}"]`).checked = true;
    deleteEntry(index);
}

function deleteEntry(index) {
    entries.splice(index, 1);
    updateLocalStorage();
    renderEntries();
}

addEntryButton.addEventListener('click', addEntry);
filterRadios.forEach(radio => {
    radio.addEventListener('change', () => renderEntries(radio.value));
});

renderEntries();
