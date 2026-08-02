import puppeteer from "puppeteer"
import ejs from "ejs"
import fs from "fs"
import path from "path"

//generate PDF certificate - this gives the path to the certificate
export const generatePDF = async (data) => {

    // Folder where generated certificates will be stored
    const certificateFolder = path.join(
        "src",
        "public",
        "certificates"
    );

    // Create the folder if it doesn't exist
    if (!fs.existsSync(certificateFolder)) {
        fs.mkdirSync(certificateFolder, { recursive: true });
    }

    // Path to the EJS template
    const templatePath = path.join(
        "src",
        "templates",
        "certificate.ejs"
    );

    // Render the HTML
    const html = await ejs.renderFile(templatePath, {
        ...data,
        logo: path.resolve("src/public/images/impacthub-logo.png"),
        signature: path.resolve("src/public/images/signature.png")
    });

    // Launch Chrome
    const browser = await puppeteer.launch({
        headless: true,
        executablePath: process.env.CHROME_PATH,
    });

    const page = await browser.newPage();

    // Load rendered HTML
    await page.setContent(html, {
        waitUntil: "networkidle0"
    });

    // Save location
    const pdfPath = path.join(
        certificateFolder,
        `${data.certificateId}.pdf`
    );

    // Generate PDF
    await page.pdf({
        path: pdfPath,
        format: "A4",
        landscape: true,
        printBackground: true
    });

    await browser.close();

    return `/certificates/${data.certificateId}.pdf`;
};