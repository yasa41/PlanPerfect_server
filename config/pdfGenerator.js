import pdfcrowd from "pdfcrowd";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export const generatePdfBuffer = async (html) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new pdfcrowd.HtmlToPdfClient(
        process.env.PDFCROWD_USER,
        process.env.PDFCROWD_API_KEY
      );

      // ---- create a temporary filename ----
      const tmpFile = path.join(process.cwd(), `temp_${randomUUID()}.pdf`);

      // ---- convert HTML → PDF and store to file ----
      client.convertStringToFile(
        html,
        tmpFile,
        (err, fileName) => {
          if (err) return reject(err);

          // ---- read PDF file into buffer ----
          const buffer = fs.readFileSync(tmpFile);

          // ---- delete temp file ----
          fs.unlinkSync(tmpFile);

          // ---- return buffer to controller ----
          resolve(buffer);
        }
      );

    } catch (error) {
      reject(error);
    }
  });
};
