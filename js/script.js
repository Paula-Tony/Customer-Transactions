"use strict";

/*
  ^ I haven't used React because I will study it in a frontend diploma at Cycle 43.
  ^ Also, if I create a JSON local server, I won't be able to upload and run it on GitHub Pages.
*/

document.addEventListener("DOMContentLoaded", () => {
  const transactionTable = document.getElementById("transactionTable");
  const searchInput = document.getElementById("searchInput");
  const transactionChart = document.getElementById("transactionChart");

  let customers;
  let transactions;
  let chart;

  async function fetchData() {
    const response = await fetch("data.json");
    const data = await response.json();

    customers = data.customers;
    transactions = data.transactions;

    transactions.sort((a, b) => {
      if (a.customer_id === b.customer_id) {
        return new Date(a.date) - new Date(b.date);
      } else {
        return a.customer_id - b.customer_id;
      }
    });

    displayTransactions();
  }

  function displayTransactions() {
    customers.forEach((customer) => {
      const row = document.createElement("tr");
      row.dataset.id = customer.id;
      row.dataset.bsToggle = 'modal';
      row.dataset.bsTarget = '#chartModal';
      row.innerHTML = `
        <td>${customer.id}</td>
        <td>${customer.name}</td>`;

      const rowTransactionAmount = document.createElement("td");
      rowTransactionAmount.className = "px-0";

      const rowTransactionDate = document.createElement("td");
      rowTransactionDate.className = "px-0";

      const customerTransactions = transactions.filter(
        (transaction) => transaction.customer_id == customer.id
      );

      customerTransactions.forEach((transaction, index, arr) => {
        rowTransactionAmount.innerHTML +=
          transaction.amount +
          (index != arr.length - 1 ? '<hr class="my-2" />' : "");
        rowTransactionDate.innerHTML +=
          transaction.date +
          (index != arr.length - 1 ? '<hr class="my-2" />' : "");
      });

      row.appendChild(rowTransactionAmount);
      row.appendChild(rowTransactionDate);

      row.addEventListener("click", displayChart);

      transactionTable.appendChild(row);
    });
  }

  function filterData() {

    const searchValue = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowText = row.innerText.toLowerCase();
      if (rowText.includes(searchValue)) {
        row.classList.remove("d-none");
      } else {
        row.classList.add("d-none");
      }
    });
  }

  function displayChart(event) {
    
    if (chart) chart.destroy();

    const customerId = event.target.parentElement.dataset.id;
    const customerTransactions = transactions.filter(
      (t) => t.customer_id == customerId
    );

    const labels = [...new Set(customerTransactions.map((t) => t.date))];
    
    const data = labels.map((date) =>
      customerTransactions
        .filter((t) => t.date === date)
        .reduce((sum, t) => sum + t.amount, 0)
    );

    chart = new Chart(transactionChart, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Total Transaction Amount",
            data: data,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            bodyColor: 'white',
            titleColor: 'white',
            footerColor: 'white' 
          }
        },
        scales: {
          x: {
            grid: {
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          },
          y: {
            grid: {
              color: 'white'
            },
            ticks: {
              color: 'white'
            }
          }
        }
      }
    });
    
    
  }

  searchInput.addEventListener("keyup", filterData);

  fetchData();
});
