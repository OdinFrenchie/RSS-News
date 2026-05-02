import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("/proxy", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing URL");

    try {
        const response = await fetch(url);
        const text = await response.text();
        res.send(text);
    } catch (e) {
        res.status(500).send("Proxy error: " + e.toString());
    }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
