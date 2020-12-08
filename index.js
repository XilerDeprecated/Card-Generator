const express = require("express");
const app = express();
const nodeHtmlToImage = require("node-html-to-image");
const fs = require("fs");

const PORT = process.env.PORT || 25579;

app.get(`/mee6`, async function (req, res) {
//  try {
    const data = fs.readFileSync("./pages/7KHL0rQmgfNO3neM5MgWuJGYPXYtWZf21DzABROzD2MBBqHaD0HUPDSXa8rcqOZx.hbs", "utf8");

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
      puppeteerArgs: {
 	args: ["--no-sandbox"]
      },
      content: {
        user: req.query.user || "Username",
        discriminator: req.query.discriminator || "9999",
        current: req.query.current || "0",
        max: req.query.max || "0",
        rank: req.query.rank || "0",
        level: req.query.level || "0",
        progress: (req.query.current / req.query.max) * 100 || "0",
        status: getStatus(),
        avatar: req.query.avatar || "https://discord.com/assets/6debd47ed13483642cf09e832ed0bc1b.png",
        color: req.query.color || "2BBADE",
      },
    });
    res.writeHead(200, { "Content-Type": "image/png" });
    res.end(image, "binary");
//  } catch (err) {
//    res.status(500).send(err);
//  }
});

app.listen(PORT, () => console.log("Ready freddy!"));
