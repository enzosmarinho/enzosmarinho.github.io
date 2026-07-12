const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const USERNAME = "enzosmarinho";
const PROFILE_URL = `https://www.instagram.com/${USERNAME}/`;
const OUTPUT = path.resolve(__dirname, "..", "assets", "instagram-profile.jpg");
const METADATA = path.resolve(__dirname, "..", "assets", "instagram-profile.json");
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36";

async function pictureFromOfficialApi() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return null;
  const url = new URL("https://graph.instagram.com/me");
  url.searchParams.set("fields", "username,profile_picture_url");
  url.searchParams.set("access_token", token);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Instagram API returned ${response.status}`);
  const data = await response.json();
  if (data.username && data.username !== USERNAME) {
    throw new Error(`Token belongs to @${data.username}, expected @${USERNAME}`);
  }
  return data.profile_picture_url ? { url: data.profile_picture_url, width: null, height: null } : null;
}

async function pictureFromPublicProfile() {
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ locale: "pt-BR", userAgent: USER_AGENT });
    const page = await context.newPage();
    await page.goto(PROFILE_URL, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    const selector = [
      `img[alt*="perfil de ${USERNAME}"]`,
      `img[alt*="profile picture of ${USERNAME}"]`,
      `img[alt*="Profile picture of ${USERNAME}"]`,
    ].join(",");
    const images = page.locator(selector);
    await images.first().waitFor({ state: "visible", timeout: 20000 });
    const candidates = await images.evaluateAll((elements) => elements.map((element) => ({
      url: element.currentSrc || element.src,
      width: element.naturalWidth,
      height: element.naturalHeight,
    })));
    return candidates.sort((a, b) => (b.width * b.height) - (a.width * a.height))[0] || null;
  } finally {
    await browser.close();
  }
}

async function downloadPicture(url) {
  const response = await fetch(url, {
    headers: { Referer: "https://www.instagram.com/", "User-Agent": USER_AGENT },
  });
  if (!response.ok) throw new Error(`Image download returned ${response.status}`);
  const contentType = response.headers.get("content-type") || "";
  const bytes = Buffer.from(await response.arrayBuffer());
  if (!contentType.startsWith("image/") || bytes.length < 2000) {
    throw new Error(`Invalid profile image: ${contentType}, ${bytes.length} bytes`);
  }
  return bytes;
}

function digest(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

async function main() {
  const picture = (await pictureFromOfficialApi()) || (await pictureFromPublicProfile());
  if (!picture?.url) throw new Error("Instagram did not return a profile picture URL");
  if (picture.width && picture.width < 200) {
    throw new Error(`Instagram returned only ${picture.width}x${picture.height}; keeping the current fallback`);
  }
  const sourceId = new URL(picture.url).pathname.split("/").pop();
  const metadata = fs.existsSync(METADATA) ? JSON.parse(fs.readFileSync(METADATA, "utf8")) : {};
  if (sourceId && metadata.sourceId === sourceId && fs.existsSync(OUTPUT)) {
    console.log("Instagram profile picture is already current.");
    return;
  }
  const incoming = await downloadPicture(picture.url);
  const current = fs.existsSync(OUTPUT) ? fs.readFileSync(OUTPUT) : null;
  if (current && digest(current) === digest(incoming)) {
    console.log("Instagram profile picture is already current.");
    return;
  }
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, incoming);
  fs.writeFileSync(METADATA, `${JSON.stringify({ username: USERNAME, sourceId }, null, 2)}\n`);
  console.log(`Updated ${OUTPUT} (${incoming.length} bytes).`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
