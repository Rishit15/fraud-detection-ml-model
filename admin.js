/* ================================
     CONFIG
================================ */
const API_BASE_URL = "http://127.0.0.1:5000/api";
    
console.log("admin.js loaded!");

// Mock data generator for fallback
  function generateMockAdminData() {
    const statuses = ["Pending", "Confirmed", "Rejected"];
    const mockData = [];
    
    for (let i = 1; i <= 15; i++) {
      mockData.push({
        tender_id: `T${String(i).padStart(5, '0')}`,
        tender_value_amount: Math.floor(Math.random() * 5000000) + 100000,
        tender_numberOfTenderers: Math.floor(Math.random() * 20) + 2,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
    return mockData;
  }

  async function fetchAdminData() {
    try {
      console.log("🔄 Fetching admin data from:", API_BASE_URL + "/anomalies");
      const res = await fetch(`${API_BASE_URL}/anomalies`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      console.log("📡 API Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = (await res.json()).result;
      console.log("✅ API data received:", data.length, "records");
      
      // Ensure data has required fields and proper types
      const processedData = data.map(item => ({
        tender_id: String(item.tender_id || 'N/A'),
        tender_value_amount: Number(item.tender_value_amount || 0),
        tender_numberOfTenderers: Number(item.tender_numberOfTenderers || 0),
        status: String(item.status || 'Pending')
      }));
      
      console.log("📊 Status distribution:");
      console.log("   Pending:", processedData.filter(data => data.status === "Pending").length);
      console.log("   Confirmed:", processedData.filter(data => data.status === "Confirmed").length);
      console.log("   Rejected:", processedData.filter(data => data.status === "Rejected").length);
      console.log("   Clean:", processedData.filter(data => data.status === "Clean").length);

      return processedData;
      
    } catch (err) {
      console.warn("⚠️ Admin API error:", err.message);
      console.log("📊 Using fallback mock data");
      const mockData = generateMockAdminData();
      console.log("✅ Generated", mockData.length, "mock records");
      return mockData;
    }
  }  
  /* ================================
      RENDER ADMIN UI
  ================================ */
  function renderAdmin(data) {
    console.log("🔄 Rendering admin with", data.length, "records");
    
    const pendingTable = document.getElementById("pendingCasesTable");
    const approvedTable = document.getElementById("approvedCasesTable");
    const rejectedTable = document.getElementById("rejectedCasesTable");

    // Check if tables exist
    if (!pendingTable || !approvedTable || !rejectedTable) {
      console.error("❌ One or more table elements not found");
      console.log("pendingTable:", pendingTable);
      console.log("approvedTable:", approvedTable);
      console.log("rejectedTable:", rejectedTable);
      return;
    }

    // Clear tables
    pendingTable.innerHTML = "";
    approvedTable.innerHTML = "";
    rejectedTable.innerHTML = "";

    // Counters
    let pendingCount = 0;
    let confirmedCount = 0;
    let rejectedCount = 0;

    // Filter data by status
    const pendingData = data.filter(item => item.status === "Pending" );
    const confirmedData = data.filter(item => item.status === "Confirmed");
    const rejectedData = data.filter(item => item.status === "Rejected");

    // Render pending cases
    pendingData.slice(0, 20).forEach(item => {
      const tr = document.createElement("tr");
      const tenderId = item.tender_id || "N/A";
      const amount = Number(item.tender_value_amount || 0).toLocaleString('en-IN');
      const bidders = Number(item.tender_numberOfTenderers || 0);
      
      pendingCount++;

      const actionCell = `
        <td>
          <div class="action-btns">
            <button class="btn-confirm" onclick="updateCase('${tenderId}', 'Confirmed')">
              Approve
            </button>
            <button class="btn-reject" onclick="updateCase('${tenderId}', 'Rejected')">
              Reject
            </button>
          </div>
        </td>
      `;

      tr.innerHTML = `
        <td>${tenderId}</td>
        <td>₹${amount}</td>
        <td>${bidders}</td>
        <td>
          <span class="status-badge pending">
            PENDING
          </span>
        </td>
        ${actionCell}
      `;

      pendingTable.appendChild(tr);
    });

    // Render confirmed cases
    confirmedData.slice(0, 20).forEach(item => {
      const tr = document.createElement("tr");
      const tenderId = item.tender_id || "N/A";
      const amount = Number(item.tender_value_amount || 0).toLocaleString('en-IN');
      const bidders = Number(item.tender_numberOfTenderers || 0);
      
      confirmedCount++;

      tr.innerHTML = `
        <td>${tenderId}</td>
        <td>₹${amount}</td>
        <td>${bidders}</td>
        <td>
          <span class="status-badge confirmed">
            CONFIRMED
          </span>
        </td>
      `;

      approvedTable.appendChild(tr);
    });

    // Render rejected cases
    rejectedData.slice(0, 20).forEach(item => {
      const tr = document.createElement("tr");
      const tenderId = item.tender_id || "N/A";
      const amount = Number(item.tender_value_amount || 0).toLocaleString('en-IN');
      const bidders = Number(item.tender_numberOfTenderers || 0);
      
      rejectedCount++;

      tr.innerHTML = `
        <td>${tenderId}</td>
        <td>₹${amount}</td>
        <td>${bidders}</td>
        <td>
          <span class="status-badge rejected">
            REJECTED
          </span>
        </td>
      `;

      rejectedTable.appendChild(tr);
    });

    // Update summary counters
    const pendingEl = document.getElementById("pending-review-count");
    const confirmedEl = document.getElementById("confirmed-fraud-count");
    const rejectedEl = document.getElementById("rejected-fraud-count");

    const totalPending = data.filter(data => data.status === "Pending").length;
    const totalConfirmed = data.filter(data => data.status === "Confirmed").length;
    const totalRejected = data.filter(data => data.status === "Rejected").length;

    if (pendingEl) {
      pendingEl.textContent = totalPending;
      console.log("✅ Pending count:", totalPending);
    }
    if (confirmedEl) {
      confirmedEl.textContent = totalConfirmed;
      console.log("✅ Confirmed count:", totalConfirmed);
    }
    if (rejectedEl) {
      rejectedEl.textContent = totalRejected;
      console.log("✅ Rejected count:", totalRejected);
    }

    console.log("✅ Admin rendered successfully");
  }
  /* ================================
      UPDATE CASE STATUS
  ================================ */
  // Update case status - ADD THIS COMPLETE FUNCTION
  async function updateCase(tenderId, newStatus) {
    const API_BASE_URL = "http://127.0.0.1:5000/api";  // match your ui.js
    
    try {
      console.log(`🔄 Updating ${tenderId} to ${newStatus}`);
      
      const response = await fetch(`${API_BASE_URL}/cases/${tenderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Update successful');
      
      // Refresh data and re-render
      const freshData = await fetchAdminData();
      renderAdmin(freshData);
      
    } catch (error) {
      console.error('❌ Update failed:', error);
      alert(`Failed to update ${tenderId}: ${error.message}`);
    }
  }


  /* ================================
      INITIALIZE ON PAGE LOAD
  ================================ */
async function initializeAdminPanel() { 
    console.log("🚀 Admin Panel: Strategic Signal Received.");
    
    const data = await fetchAdminData();
    
  
    console.log("📊 Data Governance: Rendering", data.length, "items");
    

    renderAdmin(data);
    
    console.log("✅ Admin System Online");
}

