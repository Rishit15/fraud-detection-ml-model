// Initialize Theme
function initializeSettingsTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
}

// Toggle Switch Labels
document.addEventListener('change', function (e) {
  if (e.target.type === 'checkbox') {
    const labels = {
      'emailNotif': 'emailNotifLabel',
      'pushNotif': 'pushNotifLabel',
      'highPriorityAlert': 'highPriorityLabel',
      'dailySummary': 'dailySummaryLabel',
      'autoExport': 'autoExportLabel',
      'twoFactorAuth': 'twoFactorLabel',
      'loginNotif': 'loginNotifLabel',
      'retryRequests': 'retryLabel'
    };

    if (labels[e.target.id]) {
      const labelEl = document.getElementById(labels[e.target.id]);
      labelEl.textContent = e.target.checked ? 'Enabled' : 'Disabled';
    }
  }
});

// Load Settings from localStorage
function loadSettings() {
  const settings = JSON.parse(localStorage.getItem('prismSettings')) || {};

  // Default labels dictionary for checkboxes
  const labels = {
    'emailNotif': 'emailNotifLabel',
    'pushNotif': 'pushNotifLabel',
    'highPriorityAlert': 'highPriorityLabel',
    'dailySummary': 'dailySummaryLabel',
    'autoExport': 'autoExportLabel',
    'twoFactorAuth': 'twoFactorLabel',
    'loginNotif': 'loginNotifLabel',
    'retryRequests': 'retryLabel'
  };

  Object.keys(settings).forEach(key => {
    const element = document.getElementById(key);
    if (element) {
      if (element.type === 'checkbox') {
        element.checked = settings[key];
        // Update the display label immediately upon loading
        if (labels[key]) {
          const labelEl = document.getElementById(labels[key]);
          if (labelEl) labelEl.textContent = element.checked ? 'Enabled' : 'Disabled';
        }
      } else {
        element.value = settings[key];
      }
    }
  });
}

// Save Settings
document.getElementById('saveBtn').addEventListener('click', function () {
  const settings = {};

  // Collect all input values
  document.querySelectorAll('input, select').forEach(el => {
    if (el.id) {
      if (el.type === 'checkbox') {
        settings[el.id] = el.checked;
      } else {
        settings[el.id] = el.value;
      }
    }
  });

  localStorage.setItem('prismSettings', JSON.stringify(settings));

  // Show success message
  const successMsg = document.getElementById('successMessage');
  successMsg.style.display = 'block';
  document.getElementById('lastModified').textContent = new Date().toLocaleTimeString();

  setTimeout(() => {
    successMsg.style.display = 'none';
  }, 3000);
});

// Reset to Default
document.getElementById('resetBtn').addEventListener('click', function () {
  if (confirm('Are you sure you want to reset all settings to default?')) {
    localStorage.removeItem('prismSettings');
    location.reload();
  }
});

// Export Settings
document.getElementById('exportBtn').addEventListener('click', function () {
  const settings = localStorage.getItem('prismSettings');
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(settings);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `prism_settings_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
});

// Initialize
document.addEventListener('DOMContentLoaded', function () {
  console.log("Settings page loading...");
  initializeSettingsTheme();
  loadSettings();
  document.getElementById('lastModified').textContent = new Date().toLocaleTimeString();
});
