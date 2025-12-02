import puppeteer from "puppeteer";
export const generateInvitePDF = async (html) => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const buffer = await page.pdf({ format: "A5", printBackground: true });
  await browser.close();
  return buffer;
};
