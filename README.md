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

## Google Sheets Setup

### 1. Create Google Sheet

Create a new Google Sheet with the following columns:

| Column | Description |
|--------|-------------|
| A | Booking Reference |
| B | Package ID |
| C | Package Title |
| D | Base Price |
| E | Total Price |
| F | Original Price |
| G | Discount Applied |
| H | Discount Amount |
| I | Number of People |
| J | Contact Email |
| K | Contact Phone |
| L | Contact Address |
| M | Special Requests |
| N | Selected Options (JSON) |
| O | Travelers (JSON) |
| P | Payment Status |
| Q | Created At |

### 2. Google Apps Script Setup

1. Open Google Apps Script (script.google.com)
2. Create a new project
3. Replace the default code with the following:

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
        return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Invalid action'}));
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: error.toString()}));
  }
}

function createBooking(sheet, data) {
  const row = [
    data.bookingReference,
    data.packageId,
    data.packageTitle,
    data.basePrice,
    data.totalPrice,
    data.originalPrice || '',
    data.discountApplied,
    data.discountAmount,
    data.numberOfPeople,
    data.contactEmail,
    data.contactPhone,
    data.contactAddress,
    data.specialRequests,
    data.selectedOptions,
    data.travelers,
    data.paymentStatus,
    data.createdAt
  ];
  
  sheet.appendRow(row);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function getPackageCapacity(sheet, packageId) {
  const data = sheet.getDataRange().getValues();
  const packageCapacities = {1: 100, 2: 300, 3: 30, 4: 200, 5: 150, 6: 50};
  const capacity = packageCapacities[packageId] || 50;
  
  let totalBooked = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] == packageId && data[i][15] === 'paid') { // Column P (Payment Status)
      totalBooked += data[i][8]; // Column I (Number of People)
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
  }));
}

function getDiscountInfo(sheet) {
  const data = sheet.getDataRange().getValues();
  let paidBookings = 0;
  
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
  }));
}

function getBooking(sheet, bookingReference) {
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
      }));
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({success: false, error: 'Booking not found'}));
}
```

### 3. Deploy Apps Script

1. Click "Deploy" > "New deployment"
2. Choose "Web app" as type
3. Set execute as "Me"
4. Set access to "Anyone"
5. Click "Deploy" and copy the web app URL

### 4. Environment Variables

Create a `.env` file in the project root:

```env
VITE_GOOGLE_APPS_SCRIPT_URL=your_apps_script_web_app_url_here
```

## Package Capacities

- **Platinum Pack (Desert Adventure)**: 100 people
- **Diamond Pack (Luxury Desert)**: 300 people  
- **VIP Pack (Ultimate Luxury)**: 30 people
- **Tunis City Tour**: 200 people
- **Carthage & Sidi Bou Said**: 150 people
- **Sajnene Pottery Master Class**: 50 people

## Payment Management

1. **Booking Submission**: Customers fill out the booking form
2. **Google Sheets Storage**: All data is stored with "pending" payment status
3. **Manual Payment Processing**: Manager contacts customer for payment
4. **Status Update**: Manager updates "Payment Status" column to "paid"
5. **Availability Update**: Website automatically reflects new availability

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