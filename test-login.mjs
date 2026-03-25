const fetch = require("node-fetch") || global.fetch;

async function testLogin() {
  const res = await fetch("https://fab-shopper.vercel.app/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@fabshopper.com", password: "password123" })
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Body:", text);
}

testLogin();
