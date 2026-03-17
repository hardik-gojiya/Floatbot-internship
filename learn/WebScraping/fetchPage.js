import axios from "axios";

async function fetchPage(url) {
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; RAGBot/1.0; +https://yourdomain.com)",
    },
  });
  return data;
}

// fetchPage("https://hardik-gojiya-portfolio.netlify.app/").then((html) => {
//   console.log(html);
// });

export default fetchPage;
