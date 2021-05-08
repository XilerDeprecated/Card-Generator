const express = require("express");
const app = express();
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");

const PORT = process.env.PORT || 25579;

const getImage = async (data, params) =>
  await nodeHtmlToImage({
    html: data,
    type: "png",
    transparent: true,
    content: params,
    puppeteerArgs: {
      headless: false,
      devtools: false,
      args: [
        "--disable-canvas-aa",
        "--disable-2d-canvas-clip-aa",
        "--disable-gl-drawing-for-tests",
        "--disable-dev-shm-usage",
        "--no-zygote",
        "--use-gl=desktop",
        "--enable-webgl",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--disable-infobars",
        "--disable-breakpad",
        "--user-data-dir=./chromeData",
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    },
  });

const getStatus = (status) => {
  if (!status) return "747F8D";
  switch (status.toLowerCase().trim()) {
    case "o":
    case "on":
    case "online":
      return "42B480";

    case "afk":
    case "idle":
      return "FAA61A";

    case "dnd":
    case "do-not-disturb":
    case "do_not_disturb":
    case "donotdisturb":
    case "do%20not%20disturb":
      return "EF4646";

    case "off":
    case "offline":
    default:
      return "747F8D";
  }
};

const getImageFromData = async (data, query) =>
  await getImage(data, {
    user: query.user || "Username",
    discriminator: query.discriminator || "9999",
    current: query.current || "0",
    max: query.max || "0",
    rank: query.rank || "0",
    level: query.level || "0",
    progress: (query.current / query.max) * 100 || "0",
    status: getStatus(query.status),
    avatar:
      query.avatar ||
      "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
    color: query.color || "2BBADE",
  });

const getBinaryImage = async (path, req) => {
  const data = fs.readFileSync(path, "utf8");
  return await getImageFromData(data, req.query);
};

app.get(`/mee6`, async (req, res) => {
  try {
    const image = await getBinaryImage("./pages/mee6.hbs", req);

    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image, "binary");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get(`/short`, async function (req, res) {
  try {
    const image = await getBinaryImage("./pages/short.hbs", req);

    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image, "binary");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () =>
  console.log(`Up and running on http://127.0.0.1:${PORT}`)
);
