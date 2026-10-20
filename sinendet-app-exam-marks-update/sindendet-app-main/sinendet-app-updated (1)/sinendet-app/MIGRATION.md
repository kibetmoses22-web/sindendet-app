# Moving the site (and all its data) to a different Netlify site

Netlify Blobs data belongs to one site and can't be copied from the dashboard,
so the data is moved with a script. Takes ~15 minutes plus copy time.

## 1. Set up the NEW site first
1. Create the new site from this same project (GitHub-connected, as in README.md)
   and let it deploy once.
2. In the new site: **Site configuration → Environment variables** — add the same
   `ADMIN_USERNAME`, `ADMIN_PASSWORD` and `JWT_SECRET` as the old site (if you
   never set them, skip this; the defaults are built in). Redeploy.

## 2. Collect 4 values
- **Site IDs**: each site's *Site configuration → General → Site ID*.
- **Token**: netlify.com → User settings → Applications → *Personal access tokens*
  → New access token. One token works for both sites if both are on your account;
  otherwise make one per account. Delete the token(s) when finished.

## 3. Run the copy (on your computer, with Node.js installed)
From this project folder:

    npm install
    # Windows PowerShell:
    $env:OLD_SITE_ID="..."; $env:OLD_TOKEN="..."; $env:NEW_SITE_ID="..."; $env:NEW_TOKEN="..."
    # Mac/Linux: prefix the command with the four VAR=value pairs instead
    node scripts/migrate-blobs.js --dry-run     # just counts what will be copied
    node scripts/migrate-blobs.js               # the real copy

It copies submissions, photos/video/audio, the student roster (with photos),
subject-complete flags and the activity log. It is safe to re-run — anything
already copied is skipped — and it never changes or deletes the old site.

## 4. Check, then switch
Open the new site: check the subject counts on the home page, open a few
entries with video/photos, and sign in as admin. Keep the old site until you're
happy, then tell teachers the new link (or move the custom domain across).
