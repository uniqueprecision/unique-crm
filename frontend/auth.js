// FULL FINAL CODE
// 👉 Paste at: frontend/admin.js

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin UI Initializing...');

    // --- 1. CORE API CALLS ---
    const API = {
        fetchData: async (endpoint) => {
            try {
                const res = await fetch(`http://localhost:3000/api/${endpoint}`);
                return await res.json();
            } catch (err) {
                console.error(`Error fetching ${endpoint}:`, err);
                return [];
            }
        },
        postData: async (endpoint, data) => {
            try {
                const res = await fetch(`http://localhost:3000/api/${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                return await res.json();
            } catch (err) {
                console.error(`Error posting to ${endpoint}:`, err);
                return null;
            }
        }
    };

    // --- 2. DATA LOADERS & UI POPULATORS ---

    async function refreshAll() {
        await loadCustomers();
        await loadEnquiries();
        await loadOrders();
        await loadDesigners();
    }

    async function loadCustomers() {
        const customers = await API.fetchData('customers');
        const tableBody = document.querySelector('#customerTable tbody');
        const dropdown = document.querySelector('#enquiryCustomerSelect');
        
        if (tableBody) {
            tableBody.innerHTML = customers.map(c => `
                <tr><td>${c.id || ''}</td><td>${c.name}</td><td>${c.phone}</td></tr>
            `).join('');
        }
        
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Select Customer</option>' + 
                customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
        }
    }

    async function loadEnquiries() {
  const res = await fetch("/api/enquiries/list");
  const data = await res.json();

  const table = document.getElementById("enquiryTable");
  table.innerHTML = "";

  data.forEach(e => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.customerName}</td>
      <td>${e.requirement}</td>
      <td>
        <span class="status ${e.status === "NEW" ? "blue" : "gray"}">
          ${e.status}
        </span>
      </td>
      <td>
        ${
          e.status === "NEW"
            ? `<button class="btn-small" onclick="convertToOrder('${e.id}', '${e.customerName}', '${e.requirement}')">
                 Convert
               </button>`
            : "-"
        }
      </td>
    `;

    table.appendChild(tr);
  });
}


    async function loadOrders() {
        const orders = await API.fetchData('orders');
        const tableBody = document.querySelector('#orderTable tbody');
        if (tableBody) {
            tableBody.innerHTML = orders.map(o => `
                <tr>
                    <td>${o.id}</td>
                    <td>${o.customerName}</td>
                    <td>${o.status}</td>
                    <td>
                        <select class="designer-assign-select" data-order-id="${o.id}">
                            <option>Assign Designer</option>
                        </select>
                    </td>
                </tr>
            `).join('');
            // After drawing rows, populate the dropdowns inside them
            populateDesignerDropdowns();
        }
    }

    function loadOrders() {
  fetch("/api/orders/list")
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("ordersTable");
      table.innerHTML = "";

      data.forEach(o => {
        table.innerHTML += `
          <tr>
            <td>${o.orderId}</td>
            <td>${o.customerName}</td>
            <td>${o.requirement}</td>
            <td>${o.designer || "-"}</td>
            <td>${o.status}</td>
            <td>
              <button class="btn-small">View</button>
            </td>
          </tr>
        `;
      });
    });
}


    async function loadDesigners() {
        window.designersList = await API.fetchData('designers');
        populateDesignerDropdowns();
    }

    function populateDesignerDropdowns() {
        const selects = document.querySelectorAll('.designer-assign-select');
        if (!window.designersList) return;

        selects.forEach(select => {
            const currentVal = select.value;
            select.innerHTML = '<option value="">Select Designer</option>' + 
                window.designersList.map(d => `<option value="${d.id}">${d.name}</option>`).join('');
            select.value = currentVal;
        });
    }

    // --- 3. EVENT DELEGATION (STABILITY FIX) ---

    document.addEventListener('click', async (e) => {
        // Add Customer
        if (e.target.id === 'addCustomerBtn') {
            const name = document.querySelector('#custName').value;
            const phone = document.querySelector('#custPhone').value;
            if (name && phone) {
                await API.postData('customers', { name, phone });
                document.querySelector('#custName').value = '';
                document.querySelector('#custPhone').value = '';
                await loadCustomers();
            }
        }

        // Add Enquiry
        if (e.target.id === 'addEnquiryBtn') {
            const customerId = document.querySelector('#enquiryCustomerSelect').value;
            const requirement = document.querySelector('#enquiryReq').value;
            if (customerId && requirement) {
                await API.postData('enquiries', { customerId, requirement });
                document.querySelector('#enquiryReq').value = '';
                await loadEnquiries();
            }
        }

        // Convert Enquiry to Order
        if (e.target.classList.contains('convert-btn')) {
            const enquiryId = e.target.getAttribute('data-id');
            const result = await API.postData('convert-enquiry', { enquiryId });
            if (result) {
                await loadEnquiries();
                await loadOrders();
            }
        }
    });

    // Designer Assignment Change
    document.addEventListener('change', async (e) => {
        if (e.target.classList.contains('designer-assign-select')) {
            const orderId = e.target.getAttribute('data-order-id');
            const designerId = e.target.value;
            if (designerId) {
                await API.postData('assign-designer', { orderId, designerId });
                console.log(`Order ${orderId} assigned to ${designerId}`);
            }
        }
    });

    // --- 4. INITIAL LOAD ---
    refreshAll();
});

async function convertToOrder(enquiryId, customerName, requirement) {

  if (!confirm("Convert this enquiry to Order?")) return;

  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      enquiryId,
      customerName,
      requirement
    })
  });

  const result = await res.json();

  if (result.success) {
    alert("✅ Order Created: " + result.orderId);
    loadEnquiries();
    loadOrders(); // orders table refresh
  } else {
    alert("❌ Conversion Failed");
  }
}
