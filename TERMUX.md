# Running this website on Android with Termux

This guide takes you from a fresh phone to the LeadLexity website running locally in Termux.

## 1. Install Termux

Install **Termux from F-Droid**, not the Play Store (the Play Store build is no longer updated):

<https://f-droid.org/packages/com.termux/>

Then open Termux and update the packages:

```bash
pkg update && pkg upgrade -y
pkg install -y git curl wget tar unzip
```

(Optional but recommended) allow Termux to stay running while the server is up:

```bash
pkg install -y termux-api
termux-wake-lock      # run again with: termux-wake-unlock
```

## 2. Install Node.js 22

Astro 7 requires **Node.js 22.12+**. The Node version in Termux's own repository is usually older, so install the official Linux ARM64 build into your home directory.

```bash
uname -m     # must print aarch64 (most modern phones)
```

```bash
cd ~
V=$(curl -s https://nodejs.org/dist/index.json | grep -oE '"version":"v22\.[0-9]+\.[0-9]+"' | head -1 | cut -d'"' -f4)
curl -LO "https://nodejs.org/dist/$V/node-$V-linux-arm64.tar.xz"
tar -xf "node-$V-linux-arm64.tar.xz"
mv "node-$V-linux-arm64" node22
echo 'export PATH=$HOME/node22/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
node -v     # v22.x.x
npm -v
```

If `uname -m` prints `armv7l` or `armv8l` (an older 32-bit device), the official ARM64 build will not run. Install a Linux distribution inside Termux instead and use that:

```bash
pkg install -y proot-distro
proot-distro install ubuntu
proot-distro login ubuntu
# inside Ubuntu:
apt update && apt install -y curl git
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
```

## 3. Get the code

Public repository:

```bash
cd ~
git clone https://github.com/mdibnesiampayel/leadlexity-website.git
cd leadlexity-website
```

If you made the repository private, GitHub will ask for a username and password. Use your GitHub username and, as the password, a **personal access token** with the `repo` scope — a normal account password no longer works.

## 4. Install dependencies and start the development server

```bash
npm install
npm run dev
```

The dev server binds to all interfaces on port 4321, so you can open it:

- **On the phone itself:** `http://localhost:4321`
- **From a computer on the same Wi-Fi:** `http://PHONE_IP:4321`

Find the phone IP with:

```bash
ip -4 addr show wlan0 | grep inet
```

Press `Ctrl+C` in Termux to stop the server.

## 5. Production build (optional)

```bash
npm run build      # writes the static site to dist/
npm run preview    # serves the built site on port 4321
```

Upload the contents of `dist/` to any static host (Netlify, Cloudflare Pages, Vercel, GitHub Pages static upload). `netlify.toml` is already included for Netlify.

## Commands reference

| Command             | Purpose                                              |
| ------------------- | ---------------------------------------------------- |
| `npm run dev`       | Development server with live reload on port 4321      |
| `npm run build`     | Type-check and generate the static site into `dist/`  |
| `npm run preview`   | Serve the built site locally                          |
| `npm run check`     | Astro + TypeScript diagnostics only                   |
| `npm run format`    | Format the source with Prettier                       |

## Notes and troubleshooting

- **Automated browser tests do not run on Termux.** `npm test` needs Playwright's Chromium on a desktop Linux/macOS/Windows machine. Run it there if you want to re-verify the checks; it is not required to run or edit the site.
- **`node: command not found`** — you opened a new session without loading `~/.bashrc`. Run `source ~/.bashrc`, or re-open Termux.
- **Port already in use** — another server is running. Stop it, or start on another port: `npm run dev -- --port 4322`.
- **Site unreachable from your computer** — the phone and computer must be on the same Wi-Fi network, and some routers isolate clients. Try your phone's mobile hotspot instead.
- **Slow first `npm install`** — normal on a phone; later installs are cached.
- **Keep everything inside your Termux home directory.** Android blocks execution from shared storage, so never move the project to `/sdcard`.
