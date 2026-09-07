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

Open `market-price.html` to use the district-wise price table, search, date filter and chart. The Vercel `/api/market` serverless function reads the Government of India data.gov.in market-price resource without exposing the key in the browser. In Vercel Project Settings, add an Environment Variable named `DATA_GOV_API_KEY` for Preview and Production, then redeploy:

```html
DATA_GOV_API_KEY=YOUR_DATA_GOV_API_KEY
```

If the API is unavailable, the page shows clearly marked demo prices for all 12 districts and 10 vegetables so search, filters and charts remain testable. Demo values must not be used for selling decisions; live values appear automatically once the API key is configured.
