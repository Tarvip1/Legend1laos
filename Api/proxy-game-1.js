export default async function handler(req, res) {
  const url = "http://legend147-reedix.store"; // ลิงก์จริงที่ 1
  try {
    const response = await fetch(url);
    const text = await response.text();
    res.setHeader("Content-Type", "text/html");
    res.status(200).send(text);
  } catch (err) {
    res.status(500).send("Error loading game 1");
  }
}
