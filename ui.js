/* ================================
   CONFIG
================================ */
const API_BASE_URL = "http://127.0.0.1:5000/api";

/* ================================
   THEME MANAGEMENT
================================ */
function setTheme(theme) {
  document.body.classList.remove('dark-mode', 'light-mode');
  
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    const darkBtn = document.getElementById('darkModeBtn');
    const lightBtn = document.getElementById('lightModeBtn');
    if (darkBtn) darkBtn.classList.remove('active');
    if (lightBtn) lightBtn.classList.add('active');
  } else {
    document.body.classList.add('dark-mode');
    const darkBtn = document.getElementById('darkModeBtn');
    const lightBtn = document.getElementById('lightModeBtn');
    if (darkBtn) darkBtn.classList.add('active');
    if (lightBtn) lightBtn.classList.remove('active');
  }
  
  localStorage.setItem('theme', theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

/* ================================
   CHART MANAGEMENT
================================ */
let analyticsChart = null;

function renderAnalyticsChart(data) {
  // Prepare data for chart
  const statusCounts = {
    'Pending': 0,
    'Confirmed': 0,
    'Rejected': 0,
    'Clean': 0
  };

  // Count by status
  data.forEach(item => {
    const status = item.status || 'Pending';
    if (statusCounts.hasOwnProperty(status)) {
      statusCounts[status]++;
    }
  });

  // Prepare tender value distribution (binned)
  const valueRanges = {
    '0-1M': 0,
    '1M-5M': 0,
    '5M-10M': 0,
    '10M+': 0
  };

  data.forEach(item => {
    const value = Number(item.tender_value_amount || 0);
    if (value < 1000000) valueRanges['0-1M']++;
    else if (value < 5000000) valueRanges['1M-5M']++;
    else if (value < 10000000) valueRanges['5M-10M']++;
    else valueRanges['10M+']++;
  });

  // Get chart canvas
  const chartCanvas = document.getElementById('analyticsChart');
  if (!chartCanvas) {
    console.warn("❌ Chart canvas not found");
    return;
  }

  // Destroy existing chart if it exists
  if (analyticsChart) {
    analyticsChart.destroy();
  }

  // Get theme colors
  const isDarkMode = document.body.classList.contains('dark-mode');
  const textColor = isDarkMode ? '#f8fafc' : '#0f172a';
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

  // Create chart
  const ctx = chartCanvas.getContext('2d');
  analyticsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Pending', 'Confirmed', 'Rejected', 'Clean'],
      datasets: [
        {
          label: 'Case Status Distribution',
          data: [statusCounts['Pending'], statusCounts['Confirmed'], statusCounts['Rejected'], statusCounts['Clean']],
          backgroundColor: [
            'rgba(251, 146, 60, 0.7)',  // orange - pending
            'rgba(74, 222, 128, 0.7)',  // green - confirmed
            'rgba(244, 63, 94, 0.7)',   // red - rejected
            'rgba(56, 189, 248, 0.7)'   // blue - clean
          ],
          borderColor: [
            'rgb(251, 146, 60)',
            'rgb(74, 222, 128)',
            'rgb(244, 63, 94)',
            'rgb(56, 189, 248)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: textColor,
            font: { size: 12, weight: 'bold' },
            padding: 20
          }
        },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          titleColor: textColor,
          bodyColor: textColor,
          borderColor: 'rgba(56, 189, 248, 0.5)',
          borderWidth: 1,
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
          border: { color: gridColor }
        },
        x: {
          ticks: { color: textColor, font: { size: 11 } },
          grid: { color: gridColor },
          border: { color: gridColor }
        }
      }
    }
  });

  console.log("📊 Analytics chart rendered successfully");
}

/* ================================
   FETCH DATA (Df_anomalies)
================================ */

// Mock data generator for fallback
function getMockData() {
  const statuses = ["Pending", "Confirmed", "Rejected", "Clean"];
  const mockData = [];
  
  for (let i = 1; i <= 50; i++) {
    mockData.push({
      tender_id: `T${String(i).padStart(5, '0')}`,
      tender_value_amount: Math.floor(Math.random() * 10000000) + 50000,
      tender_numberOfTenderers: Math.floor(Math.random() * 25) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  console.log("✅ Generated mock data:", mockData.length, "records");
  return mockData;
}

async function fetchDashboardData() {
  try {
    console.log("🔄 Fetching from API:", API_BASE_URL + "/anomalies");
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
    
    // Ensure data has required fields
    return data.map(item => ({
      tender_id: item.tender_id || 'N/A',
      tender_value_amount: Number(item.tender_value_amount || 0),
      tender_numberOfTenderers: Number(item.tender_numberOfTenderers || 0),
      status: item.status || 'Pending'
    }));
    
  } catch (err) {
    console.warn("⚠️ API error:", err.message);
    console.log("📊 Using fallback mock data");
    return getMockData();
  }
}

/* ================================
   FALLBACK DATA (Df_anomalies shape)
================================ */


/* ================================
   RENDER DASHBOARD UI
================================ */
function renderDashboard(data) {
  console.log("📊 Rendering dashboard:", data.length, "anomalies");
  
  // KPI calculations
  const total = data.length;
  const pending = data.filter(d => d.status === "Pending").length;
  const confirmed = data.filter(d => d.status === "Confirmed").length;
  const rejected = data.filter(d => d.status === "Rejected").length;

  // Update KPI cards - safe null checks
  const kpis = [
    { id: "kpi-transfers", value: total },
    { id: "kpi-abnormal", value: confirmed + rejected },
    { id: "kpi-pending", value: pending },
    { id: "kpi-resolved", value: confirmed + rejected }
  ];

  kpis.forEach(kpi => {
    const el = document.getElementById(kpi.id);
    if (el) {
      el.textContent = kpi.value;
    } else {
      console.warn(`KPI element #${kpi.id} not found`);
    }
  });

  // Activity table - bulletproof handling
  const table = document.getElementById("activityTable");
  if (!table) {
    console.warn("❌ Table #activityTable not found");
    return;
  }

  // Find or create tbody
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    console.warn("❌ tbody not found, creating...");
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  // Clear rows
  tbody.innerHTML = "";

  // Populate top 10 rows safely
  data.slice(0, 10).forEach(item => {
    const row = document.createElement("tr");
    
    // Safe property access
    const tenderId = item.tender_id || "N/A";
    const amount = Number(item.tender_value_amount || 0).toLocaleString();
    const bidders = item.tender_numberOfTenderers || 0;
    const status = item.status || "Pending";
    const statusClass = status.toLowerCase();

    row.innerHTML = `
      <td>${item.tender_id || 'N/A'}</td>
      <td>₹${amount}</td>
      <td>${bidders}</td>
      <td>
        <span class="status-badge ${statusClass}">
          ${status}
        </span>
      </td>
      
    `;
    
    tbody.appendChild(row);
  });

  console.log("✅ Dashboard rendered successfully");
  
  // Render analytics chart
  renderAnalyticsChart(data);
}


// ADD updateCase function to ui.js (same as admin.js)
async function updateCase(tenderId, newStatus) {
  const API_BASE_URL = "http://127.0.0.1:5000/api";
  
  try {
    const response = await fetch(`${API_BASE_URL}/cases/${tenderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    // Refresh dashboard
    const freshData = await fetchDashboardData();
    renderDashboard(freshData);
    
  } catch (error) {
    console.error('Update failed:', error);
    alert('Update failed: ' + error.message);
  }
}

/* ================================
   BOOTSTRAP
================================ */
document.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchDashboardData();
  renderDashboard(data);
});
