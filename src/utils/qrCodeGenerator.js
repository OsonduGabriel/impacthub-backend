import QRCode from "qrcode"
import fs from "fs"
import path from "path"

export const generateQRCode = async(certificateId) => {
    try {
        const qrFolder = path.join("src", "public", "qr")

        if(fs.existsSync(qrFolder)){
            //TODO: Replace this with deployed frontend URL from frontend track
            const verificationUrl = `http://localhost:3000/api/v1/certificates/verify/${certificateId}`;

            const qrPath = path.join(qrFolder, `${certificateId}.png`)
            await QRCode.toFile(qrPath, verificationUrl)

            return qrPath;
        }

        fs.mkdirSync(qrFolder, { recursive: true} )

    } catch (error) {
        throw new Error("Failed to generate QR code")
    }
}