# Penalty Box Website — Client Guide

This document explains how your website works, how to make changes, and how to deploy updates.

**Login email for everything:** thepenaltyboxwebsite@gmail.com

---

## How the Pieces Fit Together

```
Shopify (products/merch) → Website Code (GitHub) → Live Website (Netlify)
```

- **Shopify** is where you manage products, prices, and images
- **GitHub** is where the website code lives
- **Netlify** builds and hosts the live website

---

## Managing Products (Shopify)

**Login:** https://admin.shopify.com/store/penalty-box-2

This is the most common thing you'll do. No code changes needed.

### Add a new product
1. Go to **Products** → **Add product**
2. Add a title, description, price, and photos
3. Go to **Collections** → **Penalty Box Products**
4. Add the new product to this collection

The website only shows products in the **Penalty Box Products** collection. If a product isn't in that collection, it won't appear on the site.

### Remove a product from the site
1. Go to **Collections** → **Penalty Box Products**
2. Remove the product from the collection

This hides it from the website without deleting it from Shopify.

### Update photos or prices
1. Go to **Products** → click the product
2. Edit whatever you need
3. Changes show up on the website automatically (may take a minute)

---

## Making Website Changes (GitHub)

**Login:** https://github.com/ThePenaltyBox/thepenaltybox

GitHub stores all the website code. You probably won't need to touch this unless you're changing text, images, or layout on non-product pages (like the homepage, about page, or booking page).

### Editing a file directly on GitHub
1. Navigate to the file you want to edit (most pages are in `src/pages/`)
2. Click the pencil icon (edit) in the top right
3. Make your changes
4. Click **Commit changes** at the bottom
5. Netlify will automatically rebuild and deploy the site

### Common files you might edit
| What you want to change | File to edit |
|--------------------------|--------------|
| Homepage | `src/pages/index.astro` |
| About page | `src/pages/about.astro` |
| Shop page layout | `src/pages/shop/index.astro` |
| Site header/nav | `src/components/` (look for Nav or Header) |
| Site images | Upload to `public/images/` |

### Important
- Don't edit files in `node_modules/` or `dist/` — these are auto-generated
- Don't delete `.env.example` — it documents what environment variables are needed
- If something breaks, you can always click **History** on any file in GitHub to see previous versions

---

## Deploying the Website (Netlify)

**Login:** https://app.netlify.com

Netlify automatically deploys your website every time code is pushed to GitHub. You usually don't need to do anything here.

### How deploys work
1. A change is made on GitHub (edit a file, push code, etc.)
2. Netlify detects the change automatically
3. It builds the site (takes 1–2 minutes)
4. The new version goes live

### Check deploy status
1. Go to https://app.netlify.com
2. Click your site
3. Under **Deploys**, you'll see the latest builds
4. Green = success, red = something went wrong

### Trigger a manual deploy
If the site isn't updating after a Shopify product change (since product data is fetched at build time):
1. Go to your site in Netlify
2. Click **Deploys**
3. Click **Trigger deploy** → **Deploy site**

### Environment variables
These are already set up. If you ever need to check or change them:
1. Go to your site in Netlify → **Site settings** → **Environment variables**
2. The two important ones:
   - `SHOPIFY_STORE_DOMAIN` = `penalty-box-2.myshopify.com`
   - `SHOPIFY_STOREFRONT_ACCESS_TOKEN` = your Storefront API token

---

## Booking Inquiries (Netlify Forms)

When someone fills out the booking form on the `/book` page, the submission is stored in Netlify.

### View submissions
1. Go to https://app.netlify.com → your site
2. Click **Forms**
3. Click the **booking** form
4. You'll see all submissions with name, email, event type, details, etc.

### Set up email notifications
So you get an email every time someone submits a booking inquiry:
1. Go to **Forms** → **booking**
2. Click **Form notifications** → **Add notification** → **Email notification**
3. Enter the email address where you want to receive inquiries
4. Save

---

## Quick Reference

| Task | Where to do it |
|------|---------------|
| Add/remove/edit products | Shopify admin |
| Change product photos or prices | Shopify admin |
| Control which products show on the site | Shopify → Penalty Box Products collection |
| View booking inquiries | Netlify → Forms |
| Set up booking email alerts | Netlify → Forms → Notifications |
| Edit page text or layout | GitHub |
| Check if the site deployed successfully | Netlify |
| Force the site to rebuild | Netlify → Trigger deploy |
| Custom domain settings | Netlify → Domain settings |

---

## If Something Goes Wrong

- **Products not showing up:** Make sure they're in the "Penalty Box Products" collection in Shopify and have at least one photo. Then trigger a redeploy in Netlify.
- **Site shows an error:** Check the deploy log in Netlify. The error message usually explains what happened.
- **Can't log in:** All accounts use thepenaltyboxwebsite@gmail.com. Use password reset if needed.
