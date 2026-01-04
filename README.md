# 🔍 PRISM - Fraud Detection & Tender Monitoring System

> **PRISM**: Predictive Risk Identification System for Monitoring  
> An intelligent fraud detection dashboard for monitoring tender processes and identifying suspicious financial transfers in real-time.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Getting Started](#getting-started)
- [System Pages](#system-pages)
- [API Endpoints](#api-endpoints)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## 🎯 Overview

**PRISM** is a comprehensive fraud detection and risk monitoring system designed to analyze tender processes and financial transfers. It uses machine learning algorithms to detect anomalies and suspicious patterns in procurement data, helping organizations identify potential fraud and maintain compliance.

### What PRISM Does:
- 📊 **Real-time Monitoring**: Continuously analyzes tender data and financial transfers
- 🤖 **Anomaly Detection**: Uses Isolation Forest algorithm to identify suspicious patterns
- 📈 **Case Management**: Review, approve, or reject flagged cases
- 🚨 **Alert System**: Immediate notifications for high-priority fraud indicators
- 📉 **Analytics Dashboard**: Visualize trends and case statistics
- 🌙/☀️ **Dark & Light Theme**: Customizable UI with theme persistence

---

## ✨ Features

### Dashboard
- **KPI Cards**: Total transfers, abnormal transfers, pending actions, resolved cases
- **Transfer Analytics Chart**: Visual distribution of case statuses (Pending, Confirmed, Rejected, Clean)
- **Recent Transfer Activity**: Table showing latest transfers with status indicators
- **System Alerts**: Real-time notifications of system events

### Admin Panel
- **Case Review Overview**: KPI summary of pending, confirmed, and rejected cases
- **Pending Review Cases**: Flagged anomalies requiring manual review with Approve/Reject actions
- **Confirmed Fraud Cases**: Historical fraud cases that have been confirmed
- **Rejected Fraud Cases**: Cases identified as false positives
- **Status Management**: Update case statuses in real-time

### Alerts Management
- **Active Alerts List**: Real-time alert monitoring with severity levels (High, Medium, Low)
- **Alert Breakdown**: Statistics on fraud detection, abnormal activity, price anomalies, system alerts
- **Action Log**: Historical record of all administrative actions
- **Alert Configuration**: Customize which alert types to monitor

### Settings & Preferences
- **Theme Settings**: Toggle between dark and light mode (persistent across sessions)
- **System Settings**: Language, date format, timezone, auto-refresh intervals
- **Notifications**: Email, push, and daily summary configuration
- **Data Management**: Data retention, records per page, export settings
- **Security**: Session timeout, 2FA, login notifications, IP whitelist
- **User Profile**: Account information and role management
- **API Configuration**: API endpoint, timeout, and retry settings

---

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Markup structure
- **CSS3** - Advanced styling with CSS variables and glass-morphism effects
- **JavaScript (ES6+)** - Dynamic functionality and interactivity
- **Chart.js** - Data visualization library

### Backend
- **Python 3.13** - Core programming language
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-Origin Resource Sharing support
- **Pandas** - Data processing and analysis
- **Scikit-learn** - Machine learning algorithms
- **Isolation Forest** - Anomaly detection algorithm

### Data
- **CSV Format** - Input data source (main.csv)
- **JSON** - API data interchange format

---

## 📁 Project Structure

```
dashboard2/
├── index.html              # Main dashboard page
├── admin.html              # Admin/case review page
├── alerts.html             # Alerts monitoring page
├── settings.html           # Settings & preferences page
│
├── main_app.py             # Flask application (routes & API endpoints)
├── data_loader.py          # CSV data loading utility
├── ui.js                   # Shared UI functions (theme, data fetching, charting)
├── admin.js                # Admin-specific functionality
│
├── styles.css              # Global styles (dark & light theme)
├── main.csv                # Tender/transfer data (34,232+ records)
│
├── .venv/                  # Python virtual environment
├── __pycache__/            # Python cache files
│
├── README.md               # This file
└── PRISM_DOCUMENTATION/    # Additional documentation
    ├── ADMIN_DATA_FIX.md
    ├── ADMIN_PAGE_FIXES.md
    ├── CHART_FIX.md
    └── ZERO_VALUES_FIX.md
```

---

## 💻 Installation

### Prerequisites
- Python 3.10+ 
- pip (Python package manager)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Step 1: Clone/Setup Project
```bash
cd d:\PRISM-AI\dashboard2
```

### Step 2: Create Virtual Environment
```bash
python -m venv .venv
.venv\Scripts\activate  # On Windows
# source .venv/bin/activate  # On macOS/Linux
```

### Step 3: Install Dependencies
```bash
pip install flask flask-cors pandas scikit-learn
```

### Step 4: Verify Data
Ensure `main.csv` exists in the project directory:
```bash
ls -l main.csv  # Should show file size ~5MB with 34,232+ rows
```

---

## 🚀 Getting Started

### Start the Application

1. **Activate Virtual Environment**:
   ```bash
   .venv\Scripts\activate
   ```

2. **Run Flask Server**:
   ```bash
   python main_app.py
   ```

3. **Expected Output**:
   ```
   Loading data locally from main.csv...
   Loaded 34232 rows. System Synchronized.
   * Running on http://127.0.0.1:5000
   ```

4. **Access in Browser**:
   - Dashboard: `http://localhost:5000/`
   - Admin: `http://localhost:5000/admin`
   - Alerts: `http://localhost:5000/alerts`
   - Settings: `http://localhost:5000/settings`

### Stop the Server
Press `CTRL+C` in the terminal

---

## 📄 System Pages

### 🏠 Dashboard (`/`)
**Purpose**: Monitor key metrics and recent activity

**Components**:
- KPI Cards: 4 cards showing overall statistics
- Transfer Analytics Chart: Bar chart showing case distribution
- Recent Transfer Activity: Table of 10 latest transfers
- System Alerts: 3 sample alert notifications

**Data Sources**:
- Fetches from `/api/anomalies`
- Falls back to 50 mock records if API unavailable

---

### 👨‍⚖️ Admin Panel (`/admin`)
**Purpose**: Review and manage flagged fraud cases

**Components**:
- Review Overview Cards: Pending, Confirmed, Rejected counts
- Pending Review Cases Table: Anomalies with Approve/Reject actions
- Approved Fraud Cases Table: Confirmed fraud cases
- Rejected Fraud Cases Table: False positive cases

**Actions**:
- Click "Approve" to mark case as confirmed fraud
- Click "Reject" to mark case as false positive
- Tables auto-update after each action

**Data Sources**:
- Fetches from `/api/anomalies`
- Falls back to 15 mock records if API unavailable

---

### 🚨 Alerts (`/alerts`)
**Purpose**: Monitor system alerts and fraud indicators

**Components**:
- Alert KPI Cards: Critical, Warning, Total, Resolved counts
- Active Alerts Table: Real-time alert list with severity and status
- Alert Breakdown: Statistics by alert type
- Action Log: History of user actions
- Alert Configuration: Toggle alert types on/off

**Features**:
- Filter alerts by priority (High/Medium/Low)
- Acknowledge individual alerts
- Clear all alerts
- Save alert configuration
- Mock data with 8+ sample alerts

---

### ⚙️ Settings (`/settings`)
**Purpose**: Configure system preferences and user settings

**Sections**:
1. **Theme Settings**: Dark/Light mode toggle
2. **System Settings**: Language, date format, timezone, auto-refresh
3. **Notifications**: Email, push, alert types
4. **Data Management**: Retention period, records per page, export format
5. **Security**: Session timeout, 2FA, login notifications
6. **User Profile**: Name, email, department, role
7. **API Configuration**: Endpoint, timeout, retry settings

**Features**:
- All settings persist to browser localStorage
- Save configuration button
- Reset to defaults option
- Export settings as JSON file
- Settings sync across pages

---

## 🔌 API Endpoints

### HTML Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Main dashboard page |
| `/admin` | GET | Admin/case review page |
| `/alerts` | GET | Alerts monitoring page |
| `/settings` | GET | Settings & preferences page |

### Data API Routes
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/anomalies` | GET | Fetch all tender records with anomaly status |
| `/api/cases/<tender_id>` | PUT | Update case status (Pending→Confirmed/Rejected) |

### Static Files
| Extension | Served | Example |
|-----------|--------|---------|
| `.css` | Style sheets | `/styles.css` |
| `.js` | JavaScript files | `/ui.js`, `/admin.js` |
| `.csv` | Data files | `/main.csv` |

---

## 📊 API Response Format

### GET /api/anomalies Response
```json
[
  {
    "tender_id": "T00001",
    "tender_value_amount": 1500000,
    "tender_numberOfTenderers": 5,
    "status": "Pending"
  },
  {
    "tender_id": "T00002",
    "tender_value_amount": 2500000,
    "tender_numberOfTenderers": 3,
    "status": "Clean"
  }
]
```

### Status Values
- `Pending`: Anomaly detected, requires review
- `Confirmed`: Fraud confirmed
- `Rejected`: False positive (not fraud)
- `Clean`: Normal transfer, no anomaly

---

## ⚙️ Configuration

### CSV Data Structure
Expected columns in `main.csv`:
```
- tender_id: Unique identifier for tender
- tender_value_amount: Tender amount (can have formatting)
- tender_numberOfTenderers: Number of bidders
- (other columns for context)
```

### Flask Configuration
Location: `main_app.py`
```python
app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)
```

### Anomaly Detection
- Algorithm: Isolation Forest
- Contamination rate: 0.05 (5%)
- Feature: `tender_value_amount`
- Random state: 42 (reproducible)

### Theme Persistence
- Storage: Browser localStorage
- Key: `theme`
- Values: `dark` or `light`
- Default: `dark`

---

## 🐛 Troubleshooting

### Issue: Server won't start

**Error**: `ModuleNotFoundError: No module named 'flask'`

**Solution**: Install dependencies
```bash
pip install flask flask-cors scikit-learn pandas
```

---

### Issue: Static files return 404

**Error**: CSS/JS files showing 404 Not Found

**Solution**: Ensure files are in project root directory
```bash
ls -la *.js *.css *.html  # Should list all files
```

---

### Issue: No data showing on pages

**Symptoms**: KPI cards show 0, tables are empty

**Solutions**:
1. Clear browser cache: `Ctrl+Shift+Del`
2. Hard refresh: `Ctrl+F5`
3. Check CSV file: `main.csv` should exist with data
4. Verify API: Open DevTools (F12) → Network tab → Check `/api/anomalies`
5. Check console errors: DevTools → Console tab

---

### Issue: Theme not persisting

**Symptoms**: Dark/light mode resets on page reload

**Solution**: Check browser localStorage is enabled
```javascript
// In browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test');  // Should return 'value'
```

---

### Issue: Admin page shows zero values

**Symptoms**: KPI cards in admin show 0, tables empty

**Solutions**:
1. Restart Flask server: Stop (Ctrl+C) and run `python main_app.py`
2. Check Flask console output for API errors
3. Verify admin.js is loaded: DevTools → Network → Look for `admin.js` with 200 status
4. Check browser console for JavaScript errors

---

### Issue: API returns empty data

**Symptoms**: Tables show "no data" or are empty

**Debug Steps**:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `/api/anomalies` request
5. Check response - should show array of records
6. If empty, verify `main.csv` has data:
   ```bash
   python -c "import pandas as pd; print(len(pd.read_csv('main.csv')))"
   ```

---

## 📈 Performance Notes

- **Dataset Size**: 34,232+ tender records
- **Processing Time**: ~2-3 seconds on first load
- **Memory Usage**: ~200MB Python process
- **Browser Caching**: CSS/JS cached by browser
- **Theme Switching**: <100ms response time
- **Chart Rendering**: ~500ms for analytics chart

---

## 🔐 Security Considerations

- **CORS Enabled**: Cross-origin requests allowed (configured for development)
- **No Authentication**: Currently no user authentication (development environment)
- **CSV Access**: Direct file access (should restrict in production)
- **API Endpoints**: No rate limiting (add in production)
- **localStorage**: Theme and settings in client browser (not encrypted)

**Production Recommendations**:
1. Add user authentication (JWT, OAuth)
2. Implement rate limiting on API
3. Add HTTPS/SSL
4. Restrict CORS to specific domains
5. Add input validation and sanitization
6. Use database instead of CSV
7. Add audit logging
8. Implement role-based access control

---

## 📝 Development Roadmap

### Completed ✅
- Dashboard with KPI cards and analytics chart
- Admin case management system
- Alert monitoring page
- Settings with dark/light theme
- API endpoints for anomalies
- Data processing and anomaly detection
- Mobile-responsive design

### Planned 🔄
- User authentication system
- Database integration (PostgreSQL)
- Email alert notifications
- Excel/PDF export functionality
- Advanced filtering and search
- Multi-user collaboration
- Audit trail logging
- Performance dashboard
- Real-time WebSocket updates

---

## 📞 Support & Contact

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console (F12) for errors
3. Check Flask terminal output for server-side errors
4. Verify CSV file integrity
5. Ensure all dependencies are installed

---

## 📄 License

This project is part of the PRISM Fraud Detection Initiative.

---

## 🎓 Learning Resources

- **Flask Documentation**: https://flask.palletsprojects.com/
- **Chart.js Documentation**: https://www.chartjs.org/
- **Scikit-learn (Isolation Forest)**: https://scikit-learn.org/
- **Pandas Documentation**: https://pandas.pydata.org/

---

## 📊 Data Handling

### Input Data (main.csv)
- Format: CSV with headers
- Size: ~34,232 rows
- Key columns: `tender_id`, `tender_value_amount`, `tender_numberOfTenderers`
- Data processing: Automatic cleaning and type conversion

### Output Data
- Format: JSON (API responses)
- Storage: Browser localStorage (settings only)
- No persistent backend storage (development mode)

---

## 🔍 Anomaly Detection Algorithm

**Isolation Forest**:
- Unsupervised learning algorithm
- Detects outliers in numerical data
- Features used: `tender_value_amount`
- Contamination: 5% (expected anomaly rate)
- Advantage: Works well with high-dimensional data

**How it works**:
1. Load tender data
2. Normalize feature values (StandardScaler)
3. Train Isolation Forest with 5% contamination
4. Predict anomalies (-1 = anomaly, 1 = normal)
5. Label as "Pending" (anomalies) or "Clean" (normal)

---

## 🎨 UI/UX Features

### Theme System
- **CSS Variables**: Dynamic color switching
- **Dark Mode**: OLED-friendly dark colors
- **Light Mode**: High-contrast light colors
- **Persistence**: LocalStorage saves preference

### Glass Morphism Design
- Backdrop blur effects
- Semi-transparent panels
- Modern aesthetic
- Smooth transitions

### Responsive Layout
- Desktop-optimized (primary)
- Mobile-friendly sidebar
- Flexible grid layouts
- Touch-friendly buttons

---

**Last Updated**: January 3, 2026  
**Version**: 1.0.0  
**Status**: Development
