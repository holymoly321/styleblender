// Surge 面板脚本：测试 5 个主流网站连通性（换行展示，简洁美观）
const policy = $environment?.params || $argument || "DIRECT"; // 优先 UI 参数
const targets = [
  { url: "https://www.google.com", emoji: "🧭" },
  { url: "https://www.youtube.com", emoji: "▶️" },
  { url: "https://t.me", emoji: "✈️" },
  { url: "https://api.openai.com", emoji: "🤖" },
  { url: "https://twitter.com", emoji: "🕊️" }
];

function pad(str, len = 6) {
  return str + " ".repeat(Math.max(0, len - str.length));
}

async function testOne({ url, emoji }) {
  const host = url.replace(/^https?:\/\//, "").split("/")[0];
  const start = Date.now();
  return new Promise(resolve => {
    $httpClient.get({ url, policy }, (err, resp, body) => {
      const ms = Date.now() - start;
      const success = !err;
      const symbol = success ? "✅" : "❌";
      const delay = success ? `${ms}ms` : "失败";
      resolve(`${symbol} ${host}\n${emoji} ${pad(delay)}`);
    });
  });
}

(async () => {
  const results = await Promise.all(targets.map(testOne));
  const content = results.join("\n\n");
  $done({
    title: `策略组: ${policy}`,
    content,
    icon: "wave.3.right",
    "icon-color": "#3B82F6"
  });
})();