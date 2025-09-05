import urls from "../../config.json"; // ดึง config จากไฟล์แยก

export default async function handler(req, res) {
  const { id } = req.query;

  if (!urls[id]) {
    return res.status(400).json({ error: "Invalid game id" });
  }

  try {
    const response = await fetch(urls[id]);
    const text = await response.text();

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Error loading game " + id);
  }
}
