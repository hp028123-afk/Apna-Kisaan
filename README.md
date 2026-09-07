# Apna-Kisaan

अपना किसान किसानों को सब्जी बाजार, परिवहन और भुगतान से जुड़ी उपयोगी जानकारी से जोड़ने वाला responsive Hindi-first website है।

## Project

- Static HTML pages
- Shared responsive CSS
- Shared JavaScript navigation and district search
- Hindi content with Hindi/English language control
- Contact, phone and WhatsApp actions

Open `home.html` in a browser or use VS Code Live Server.

## Daily market prices

Open `market-price.html` to use the market price table, search, date filter and chart. The Vercel `/api/market` serverless function reads the open farmer.in prices feed, which attributes its data to Agmarknet and the Government of India. The feed provides commodity-level Madhya Pradesh coverage, not separate mandi records for each district, so the district selector clearly remains a regional view. If the feed is unavailable, the page shows clearly marked demo values for testing rather than presenting them as live prices.
