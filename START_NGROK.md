# Quick Start: ngrok for Mobile Testing

This guide explains how to set up ngrok for mobile testing, especially for camera access on iOS devices.

**First time setup?** See [README.md](./README.md) for project installation.

## ⚠️ Important: ngrok runs on your LAPTOP, not your phone!

Your phone just opens the HTTPS URL that ngrok provides.

---

## Step 1: Sign up for ngrok (Free)

1. Go to https://ngrok.com/signup
2. Sign up for a free account (takes 30 seconds)
3. After signing up, you'll get an authtoken

---

## Step 2: Install ngrok

**Option A: Using snap (Recommended - System-wide installation)**
```bash
sudo snap install ngrok
```

After installation, you can use it from anywhere:
```bash
ngrok http 3000
```

**Option B: Using the setup script**
```bash
./setup-ngrok.sh
```

**Option C: Manual installation**
1. Go to https://ngrok.com/download
2. Download the Linux version
3. Extract it: `unzip ngrok.zip` or `tar -xzf ngrok.tgz`
4. Make it executable: `chmod +x ngrok`
5. Move it somewhere convenient: `mv ngrok ~/bin/` or keep it in the project folder

---

## Step 2.5: Authenticate ngrok

After installing, you need to add your authtoken:
```bash
# If ngrok is in ~/bin:
~/bin/ngrok config add-authtoken YOUR_AUTHTOKEN_HERE

# Or if ngrok is in current directory:
./ngrok config add-authtoken YOUR_AUTHTOKEN_HERE
```

You can find your authtoken at: https://dashboard.ngrok.com/get-started/your-authtoken

---

## Step 3: Start your dev server (if not already running)

```bash
npm run dev
```

Keep this terminal open!

---

## Step 4: Start ngrok (in a NEW terminal)

```bash
# If you used the setup script:
~/bin/ngrok http 3000

# Or if you downloaded manually:
./ngrok http 3000
```

You'll see output like:
```
Forwarding   https://abc123.ngrok.io -> http://localhost:3000
```

**Copy the HTTPS URL** (the one starting with `https://`)

---

## Step 5: Open on your iPhone

On your iPhone Safari, open:
```
https://abc123.ngrok.io/en/scan
```
(Replace `abc123.ngrok.io` with your actual ngrok URL)

The camera should now work! 🎉

---

## Troubleshooting

- **"ngrok: command not found"**: Make sure you ran the setup script or added ngrok to your PATH
- **"Address already in use"**: Port 3000 is already in use. Stop other servers or use a different port
- **Camera still not working**: Make sure you're using the HTTPS URL (not HTTP) and Safari (not Chrome)

