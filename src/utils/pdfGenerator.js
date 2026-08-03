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

    //Read images as Base64 FIRST
    const logo = fs.readFileSync(
        path.resolve("src/public/images/impacthub-logo.png")
    ).toString("base64");

    const signature = fs.readFileSync(
        path.resolve("src/public/images/signature.png")
    ).toString("base64");

    const qr = fs.readFileSync(
        path.resolve("src/public" + data.qrCode)
    ).toString("base64");

    // Render the HTML
    const html = await ejs.renderFile(templatePath, {
        ...data,
        logo,
        signature,
        qrCode: qr
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
        printBackground: true,
        margin: {
            top: "0",
            right: "0",
            bottom: "0",
            left: "0"
        }
    });

    await browser.close();

    return `/certificates/${data.certificateId}.pdf`;
};