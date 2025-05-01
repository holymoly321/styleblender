// Surge 面板脚本：测试 5 个主流网站连通性（支持策略名中含空格）

// 解析参数，支持带空格的策略名
const argMap = Object.fromEntries(($argument || "")
  .split("&")
  .map(p => {
    const eq = p.indexOf("=");
    return eq > -1 ? [p.slice(0, eq), decodeURIComponent(p.slice(eq + 1))] : [];
  })
  .filter(p => p.length === 2)
);

const policy = argMap.policy || "DIRECT";
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