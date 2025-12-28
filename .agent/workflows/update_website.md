---
description: How to update the FlowStack website and deploy changes
---

# Updating FlowStack Website

This workflow describes how to make changes to the website and deploy them to production.

## 1. Request Changes
Ask Antigravity to make your desired edits.
Example: "Ubah warna tombol jadi biru" or "Tambahkan section baru di halaman about".

## 2. Verify Locally
Antigravity will make the changes. You should verify them locally if possible (using `npm run dev`).

## 3. Push to GitHub
Once verified, ask Antigravity to push the changes, or run this command:

```bash
// turbo
git add .
git commit -m "Update website content"
git push
```

## 4. Automatic Deployment
Once the code is pushed to GitHub, Vercel will **automatically** detect the change and build the new version of your website.
- You don't need to do anything in Vercel.
- The update usually goes live in 1-2 minutes.
