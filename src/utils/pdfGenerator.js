import puppeteer from "puppeteer"
import ejs from "ejs"
import fs from "fs"
import path from "path"

//generate PDF certificate - this gives the path to the certificate
export const generatePDF = async( data ) => {

    const certificateFolder = path.join("src", "public", "certificates")

    //check if dir exist before creating pdf document
    if(fs.existsSync(certificateFolder)){
        //template path
        const templatePath = path.join("src", "templates", "certificates.ejs")

        const html = await ejs.renderFile(templatePath, {
            ...data,
            logo: path.resolve("src/public/images/impacthub-logo.png"),
            signature: path.resolve("src/public/images/signature.png")
        })

        const browser = await puppeteer.launch( {headless: true} )

        const page = await browser.newPage()
        await page.setContent(html, { waitUntil: "networkidle0"})

        //pdf path
        const pdfPath = path.join(certificateFolder, `${data.certificateId}.pdf`)

        await page.pdf({
            path: pdfPath,
            format: "A4",
            landscape: true,
            printBackground: true
        })

        await browser.close()

        return pdfPath;
    }

    fs.mkdirSync(uploadDir, {recursive: true})
}