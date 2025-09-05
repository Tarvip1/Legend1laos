export default function handler(req, res) {
  const urls = {
    "1": "http://legend147-reedix.store",
    "2": "http://legend147-lilyvia.store",
    "3": "http://legend147-bamboora.store"
  };
  res.status(200).json(urls);
}
