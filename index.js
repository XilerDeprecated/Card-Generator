const express = require("express");
const app = express();
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");

const PORT = process.env.PORT || 25579;

app.get(`/mee6`, async function (req, res) {
  try {
    const data = fs.readFileSync(
      "./pages/7KHL0rQmgfNO3neM5MgWuJGYPXYtWZf21DzABROzD2MBBqHaD0HUPDSXa8rcqOZx.hbs",
      "utf8"
    );

    const getStatus = () => {
      if (!req.query.status) return "747F8D";
      switch (req.query.status.toLowerCase().trim()) {
        case "o":
        case "on":
        case "online":
          return "#42B480";

        case "afk":
        case "idle":
          return "#FAA61A";

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

    const image = await nodeHtmlToImage({
      html: data,
      type: "png",
      transparent: true,
      content: {
        user: req.query.user || "Username",
        discriminator: req.query.discriminator || "9999",
        current: req.query.current || "0",
        max: req.query.max || "0",
        rank: req.query.rank || "0",
        level: req.query.level || "0",
        progress: (req.query.current / req.query.max) * 100 || "0",
        status: getStatus(),
        avatar:
          req.query.avatar ||
          "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        color: req.query.color || "2BBADE",
      },
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
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image, "binary");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(PORT, () =>
  console.log(`Up and running on http://127.0.0.1:${PORT}`)
);
