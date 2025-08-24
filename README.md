# ACES Tunisia Event Website

A modern, responsive website for ACES Tunisia travel packages with Google Sheets integration for booking management.

## Features

- **6 Travel Packages**: Desert adventures, city tours, cultural experiences, and pottery workshops
- **Google Sheets Integration**: All booking data stored in Google Sheets for easy management
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Real-time Availability**: Package availability based on paid bookings in Google Sheets
- **Booking Management**: Complete booking flow with form validation
- **Early Bird Discounts**: Automatic 15% discount for first 100 bookings

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom desert theme
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Backend**: Google Sheets + Google Apps Script

## 🔐 Secure Google Sheets Setup Guide

### Step 1: Create Google Sheet

1. **Create a new Google Sheet** with the following column headers in Row 1:

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O | P | Q |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Booking Reference | Package ID | Package Title | Base Price | Total Price | Original Price | Discount Applied | Discount Amount | Number of People | Contact Email | Contact Phone | Contact Address | Special Requests | Selected Options | Travelers | Payment Status | Created At |

2. **Set up proper permissions**:
   - Click "Share" button
   - Change from "Restricted" to "Anyone with the link can view"
   - **Important**: Only give "View" access, not "Edit"

### Step 2: Create Google Apps Script

1. Open [Google Apps Script](https://script.google.com)
2. Create a new project
3. Name it "ACES Booking System"
4. Replace the default code with this:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getActiveSheet();
    
    switch(data.action) {
      case 'createBooking':
        return createBooking(sheet, data);
      case 'getPackageCapacity':
        return getPackageCapacity(sheet, data.packageId);
      case 'getDiscountInfo':
        return getDiscountInfo(sheet);
      case 'getBooking':
        return getBooking(sheet, data.bookingReference);
      default:
        return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function createBooking(sheet, data) {
  try {
    const row = [
      data.bookingReference,           // Column A
      data.packageId,                  // Column B
      data.packageTitle,               // Column C
      data.basePrice,                  // Column D
      data.totalPrice,                 // Column E
      data.originalPrice || '',        // Column F
      data.discountApplied || false,   // Column G
      data.discountAmount || 0,        // Column H
      data.numberOfPeople,             // Column I
      data.contactEmail,               // Column J
      data.contactPhone,               // Column K
      data.contactAddress,             // Column L
      data.specialRequests || '',      // Column M
      data.selectedOptions || '[]',    // Column N (JSON)
      data.travelers || '[]',          // Column O (JSON)
      data.paymentStatus || 'pending', // Column P
      data.createdAt                   // Column Q
    ];
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getPackageCapacity(sheet, packageId) {
  try {
    const data = sheet.getDataRange().getValues();
    
    // Package capacities
    const packageCapacities = {
      1: 100,  // Platinum Pack (Desert Adventure)
      2: 300,  // Diamond Pack (Luxury Desert)
      3: 30,   // VIP Pack (Ultimate Luxury)
      4: 200,  // Tunis City Tour
      5: 150,  // Carthage & Sidi Bou Said
      6: 50    // Sajnene Pottery Master Class
    };
    
    const capacity = packageCapacities[packageId] || 50;
    
    let totalBooked = 0;
    
    // Count only bookings with "paid" status
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] == packageId && data[i][15] === 'paid') { // Column B (Package ID) and Column P (Payment Status)
        totalBooked += parseInt(data[i][8]) || 0; // Column I (Number of People)
      }
    }
    
    const available = Math.max(0, capacity - totalBooked);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: {
        packageId: packageId,
        totalBooked: totalBooked,
        capacity: capacity,
        available: available,
        isFull: available === 0
      }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getDiscountInfo(sheet) {
  try {
    const data = sheet.getDataRange().getValues();
    let paidBookings = 0;
    
    // Count total paid bookings across all packages
    for (let i = 1; i < data.length; i++) {
      if (data[i][15] === 'paid') { // Column P (Payment Status)
        paidBookings++;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      data: {
        available: paidBookings < 100,
        remainingSlots: Math.max(0, 100 - paidBookings),
        totalPaidBookings: paidBookings
      }
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getBooking(sheet, bookingReference) {
  try {
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === bookingReference) { // Column A (Booking Reference)
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          data: {
            booking_reference: data[i][0],
            package_title: data[i][2],
            total_price: data[i][4],
            number_of_people: data[i][8],
            payment_status: data[i][15],
            contact_email: data[i][9],
            created_at: data[i][16]
          }
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Booking not found'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

5. **Replace `'YOUR_SHEET_ID'`** with your actual Google Sheet ID (found in the URL)
6. Save the project

### Step 3: Deploy Apps Script Securely

1. Click "Deploy" → "New deployment"
2. Choose "Web app" as type
3. **Security Settings**:
   - Execute as: **"Me"** (your account)
   - Who has access: **"Anyone"** (required for website to work)
4. Click "Deploy"
5. **Copy the web app URL** (keep this secure!)

### Step 4: Set Up Environment Variables

Create a `.env` file in your project root:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=your_web_app_url_here
```

### Step 5: Secure Access Control

#### For the Google Sheet:
1. **Share with specific people only**:
   - Add your team members with "Editor" access
   - Never share the direct sheet link publicly
   - Use "Notify people" to inform team members

2. **Set up data validation** (optional):
   - Column P (Payment Status): Data validation with "pending" or "paid" only
   - This prevents accidental data entry errors

#### For Google Apps Script:
1. **Monitor usage**:
   - Go to Apps Script → Executions to see all API calls
   - Set up email notifications for errors

2. **Version control**:
   - Create new versions when making changes
   - Keep previous versions as backup

### Step 6: Team Access Management

#### Manager Access (Full Control):
- **Google Sheet**: Editor access
- **Apps Script**: Owner/Editor access
- Can update payment status from "pending" to "paid"

#### Staff Access (View Only):
- **Google Sheet**: Viewer access
- Can see all bookings but cannot modify data

#### Developer Access:
- **Apps Script**: Editor access for maintenance
- **Google Sheet**: Editor access for testing

## 🔒 Security Best Practices

### 1. **Environment Variables**
- Never commit `.env` file to version control
- Use different URLs for development/production
- Rotate URLs periodically

### 2. **Google Sheet Security**
- Regular backups (File → Download)
- Monitor access logs
- Remove unused collaborators

### 3. **Apps Script Security**
- Review execution logs regularly
- Set up error notifications
- Keep code updated

### 4. **Data Protection**
- All customer data encrypted in transit
- Google's security handles data at rest
- GDPR compliant data handling

## Package Capacities

- **Platinum Pack (Desert Adventure)**: 100 people
- **Diamond Pack (Luxury Desert)**: 300 people  
- **VIP Pack (Ultimate Luxury)**: 30 people
- **Tunis City Tour**: 200 people
- **Carthage & Sidi Bou Said**: 150 people
- **Sajnene Pottery Master Class**: 50 people

## How It Works

### Customer Journey:
1. **Customer books** → Form submitted to Google Sheets
2. **Status = "pending"** → Booking saved but not counted toward capacity
3. **Manager contacts customer** → Arranges payment offline
4. **Manager updates Column P** → Changes "pending" to "paid"
5. **Website updates** → Available spots decrease automatically

### Manager Workflow:
1. **Check new bookings** → Filter by "pending" status
2. **Contact customers** → Use provided contact details
3. **Process payment** → Your preferred method
4. **Update status** → Change "pending" to "paid" in Column P
5. **Automatic updates** → Website reflects new availability

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

The website can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.

## Contact

- **Email**: aces.sarl.contact@gmail.com
- **Phone**: +216 20603070
- **Website**: www.aces-event.com

## Troubleshooting

### Common Issues:

1. **"Failed to fetch" errors**:
   - Check if `VITE_GOOGLE_APPS_SCRIPT_URL` is set correctly
   - Verify Apps Script is deployed as web app
   - Ensure "Anyone" access is enabled

2. **Bookings not appearing**:
   - Check Google Sheet ID in Apps Script
   - Verify column headers match exactly
   - Check Apps Script execution logs

3. **Capacity not updating**:
   - Ensure payment status is exactly "paid" (lowercase)
   - Check package IDs match (1-6)
   - Verify number of people is numeric

### Support:
- Check Apps Script execution logs for detailed errors
- Monitor Google Sheet for data integrity
- Contact development team for technical issues