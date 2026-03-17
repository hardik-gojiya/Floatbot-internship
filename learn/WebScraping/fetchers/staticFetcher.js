import axios from "axios";

export async function fetchStatic(url) {
  const res = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RAGCrawler/1.0)",
    },
  });
  return res.data;
}

// fetchStatic("https://hardik-gojiya-portfolio.netlify.app/").then((data) => {
//   console.log(data);
// });
