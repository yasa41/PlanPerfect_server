import fs from "fs";
const TEMPLATE_PATH = "./assets/baby.html";

export const getInviteTemplate = () => {
  return fs.readFileSync(TEMPLATE_PATH, "utf8");
};

export function fillTemplate(template, data) {
  let out = template;
  Object.entries(data).forEach(([key, value]) => {
    out = out.replace(new RegExp(`{{${key}}}`, "g"), value || "");
  });
  return out;
}
