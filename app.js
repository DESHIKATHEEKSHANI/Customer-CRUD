const API_URL = "http://localhost:8080/customer";

function loadCustomers() {
    fetch(`${API_URL}/get-all`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("tbl-body").innerHTML = data.map(c => `
                <tr>
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>${c.address}</td>
                    <td>${c.salary}</td>
                    <td>
                        <button onclick="deleteCustomer(${c.id})">Delete</button>
                    </td>
                </tr>
            `).join("");
        });
}

function addCustomer() {
    const customer = {
        name: getVal("add-name"),
        address: getVal("add-address"),
        salary: getVal("add-salary")
    };

    fetch(`${API_URL}/add`, reqOptions("POST", customer)).then(() => {
        alert("Added!"), clearForm("add"), loadCustomers();
    });
}

function deleteCustomer(id) {
    fetch(`${API_URL}/delete/${id}`, { method: "DELETE" })
        .then(() => alert("Deleted!"), loadCustomers());
}

function fillUpdateForm(id) {
    fetch(`${API_URL}/searchById/${id}`)
        .then(res => res.json())
        .then(c => {
            setVal("update-id", c.id);
            setVal("update-name", c.name);
            setVal("update-address", c.address);
            setVal("update-salary", c.salary);
        });
}

function updateCustomer() {
    const customer = {
        id: getVal("update-id"),
        name: getVal("update-name"),
        address: getVal("update-address"),
        salary: getVal("update-salary")
    };

    fetch(`${API_URL}/update`, reqOptions("PUT", customer)).then(() => {
        alert("Updated!"), clearForm("update"), loadCustomers();
    });
}

function searchCustomers() {
    let query = getVal("search-input");
    if (!query) return alert("Enter search query!");

    Promise.all([
        fetch(`${API_URL}/searchById/${query}`).then(res => res.ok ? res.json() : null),
        fetch(`${API_URL}/searchByName/${query}`).then(res => res.ok ? res.json() : []),
        fetch(`${API_URL}/searchByAddress/${query}`).then(res => res.ok ? res.json() : [])
    ]).then(([idResult, nameResults, addressResults]) => {
        let customers = [].concat(idResult ? [idResult] : [], nameResults, addressResults);
        if (!customers.length) return alert("No results found!");

        document.getElementById("tbl-body").innerHTML = customers.map(c => `
            <tr>
                <td>${c.id}</td>
                <td>${c.name}</td>
                <td>${c.address}</td>
                <td>${c.salary}</td>
                <td>
                    <button onclick="fillUpdateForm(${c.id})">Edit</button>
                    <button onclick="deleteCustomer(${c.id})">Delete</button>
                </td>
            </tr>
        `).join("");
    });
}

const getVal = id => document.getElementById(id).value;
const setVal = (id, val) => document.getElementById(id).value = val;
const clearForm = type => ["name", "address", "salary"].forEach(f => setVal(`${type}-${f}`, ""));
const reqOptions = (method, body) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

loadCustomers();
