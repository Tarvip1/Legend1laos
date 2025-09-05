const urls = {
  "1": "http://legend147-reedix.store",
  "2": "http://legend147-Lilyvia.store",
  "3": "http://legend147-bamboora.store"
};

export default async function handler(req, res) {
  res.status(200).json(urls);
}
