// Surge 面板脚本：测试 5 个主流网站连通性（换行展示，简洁美观）
const policy = $argument ?? ($environment?.params ?? "DIRECT");
const targets = [
  { url: "https://www.google.com", emoji: "🧭" },
  { url: "https://www.youtube.com", emoji: "▶️" },
  { url: "https://t.me", emoji: "✈️" },
  { url: "https://api.openai.com", emoji: "🤖" },
  { url: "https://twitter.com", emoji: "🕊️" }
];

async function testOne({ url, emoji }) {
  const host = url.replace("https://", "").replace("http://", "").split("/")[0];
  const start = Date.now();
  return new Promise(resolve => {
    $httpClient.get({ url, policy }, (err, resp, body) => {
      const ms = Date.now() - start;
      const ok = !err;
      const symbol = ok ? "✅" : "❌";
      const delay = ok ? `${ms}ms` : "失败";
      const result = `${symbol} ${host}\n${emoji} ${delay}`;
      resolve(result);
    });
  });
}

(async () => {
  const results = await Promise.all(targets.map(testOne));
  const body = results.join("\n\n");
  $done({
    title: `策略组: ${policy}`,
    content: body,
    icon: "wave.3.right",
    "icon-color": "#3B82F6"
  });
})();