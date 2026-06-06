# Putting LOOM online — a friendly, step-by-step guide

This guide takes you from "files on my computer" to "a real website anyone can
visit," using **GitHub Pages** (free hosting from GitHub). No coding needed —
just follow the steps in order.

You will end up with a public address like:

```
https://USERNAME.github.io/loom/
```

…where `USERNAME` is your GitHub username and `loom` is the name you give the
project on GitHub.

There are two ways to do this. **Method A (website-only)** uses your web browser
and a drag-and-drop upload — easiest if you're new. **Method B (command line)**
uses a few typed commands — faster once you've done it once. Pick whichever
feels comfortable. Both end at the same place: **Step 4 (turning Pages on)**.

---

## Before you start (one-time setup)

1. **Make a free GitHub account** at <https://github.com> if you don't have one.
   Remember your **username** — you'll need it.
2. That's it. The site itself needs nothing installed.

---

## Method A — the website way (no terminal, recommended for first time)

### Step 1 — Create an empty repository

A "repository" (or **repo**) is just a project folder that lives on GitHub.

1. Go to <https://github.com/new>.
2. **Repository name:** type `loom` (lowercase).
3. Leave it **Public** (required for free GitHub Pages).
4. Do **not** tick "Add a README" — we already have one.
5. Click the green **Create repository** button.

### Step 2 — Upload the LOOM files

1. On the new repo page, find and click the link that says
   **"uploading an existing file"** (or go to the **Add file → Upload files**
   menu).
2. Open the `loom` folder on your computer, select **everything inside it**
   (all the `.html` files, the `assets` folder, `.nojekyll`, etc.), and drag it
   all into the upload area on the page.
   - **Important:** make sure the hidden file **`.nojekyll`** gets uploaded too.
     It has no name before the dot, but it matters (it makes the `assets`
     folder work). On a Mac, press **Cmd + Shift + .** in Finder to reveal
     hidden files before dragging.
3. Scroll down and click the green **Commit changes** button.

That's your files online. Now jump to **Step 4** to switch the website on.

---

## Method B — the command line way (terminal)

Do this from inside the `loom` folder on your computer. Each numbered item is
one command — type it, then press **Enter**.

### Step 1 — Get the folder ready for GitHub

```bash
git init
git add .
git commit -m "Initial LOOM site"
git branch -M main
```

What these do, in plain words:
- `git init` — start tracking this folder.
- `git add .` — include all the files (the `.` means "everything here").
- `git commit -m "..."` — save a snapshot, with a short note.
- `git branch -M main` — name the main line of work `main` (what Pages expects).

### Step 2 — Create the repo on GitHub

**Easiest:** if you have the GitHub CLI (`gh`) installed and signed in, run:

```bash
gh repo create loom --public --source=. --remote=origin --push
```

That single command creates the repo, links it, and uploads everything. If it
worked, **skip to Step 4.**

**No `gh`?** No problem — do it by hand:
1. Go to <https://github.com/new>, name the repo `loom`, keep it **Public**,
   don't add a README, and click **Create repository**.
2. GitHub then shows a web address ending in `.git`. Copy it, then run (paste
   your address in place of the example):

```bash
git remote add origin https://github.com/USERNAME/loom.git
git push -u origin main
```

Replace `USERNAME` with your real GitHub username. This uploads your files.

---

## Step 4 — Turn GitHub Pages ON (both methods do this)

Your files are now on GitHub, but the website isn't switched on yet. One last
bit of clicking:

1. On your repo page, click the **Settings** tab (top right).
2. In the left sidebar, click **Pages**.
3. Under **"Build and deployment" → Source**, choose **Deploy from a branch**.
4. Set **Branch** to **`main`** and the folder to **`/ (root)`**.
5. Click **Save**.

GitHub now builds your site. Wait about **1–2 minutes**, then refresh that Pages
settings page. It will show a green banner with your live link:

```
https://USERNAME.github.io/loom/
```

Click it — your site is live. 🎉

> **Note:** `.nojekyll` is already included in this project, so the `assets/`
> folder (your CSS, images, and JavaScript) will load correctly. You don't have
> to do anything for that.

---

## Step 5 — One small SEO follow-up (2 minutes)

Two files contain a placeholder username so search engines know your real
address. Update them now that you know your link:

1. Open **`sitemap.xml`** and **`robots.txt`**.
2. Replace every `USERNAME` with your real GitHub username (and replace `loom`
   if you named the repo something else).
3. Save, then re-upload them (Method A) or run:

```bash
git add sitemap.xml robots.txt
git commit -m "Set real site URL in sitemap and robots"
git push
```

---

## Making changes later

Whenever you edit the site:

- **Method A:** on the repo page use **Add file → Upload files** (or edit a file
  directly with the pencil icon) and **Commit changes**.
- **Method B:** from the folder, run:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Either way, GitHub Pages rebuilds automatically in a minute or two. Refresh your
live site to see the update.

---

## If something looks wrong

- **Page loads but looks unstyled (plain text):** the `assets` folder probably
  didn't upload, or `.nojekyll` is missing. Re-upload, making sure hidden files
  are included (Mac: **Cmd + Shift + .** in Finder).
- **404 / page not found right after enabling Pages:** give it a couple more
  minutes — the first build can be slow — then refresh.
- **Link goes to the wrong place:** confirm in Settings → Pages that the branch
  is **`main`** and the folder is **`/ (root)`**.

That's everything. Welcome online. — *LOOM. Crafted, not generated.*
