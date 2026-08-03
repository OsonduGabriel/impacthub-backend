import QRCode from "qrcode"
import fs from "fs"
import path from "path"

export const generateQRCode = async(certificateId) => {
    try {
        const qrFolder = path.join("src", "public", "qr")

        if (!fs.existsSync(qrFolder)) {
            fs.mkdirSync(qrFolder, { recursive: true });
        }

        const verificationUrl = `${process.env.BASE_URL}/api/v1/certificates/verify/${certificateId}`;

        const qrPath = path.join(qrFolder, `${certificateId}.png`);

        await QRCode.toFile(qrPath, verificationUrl);

        return `/qr/${certificateId}.png`;

    } catch (error) {
        throw new Error("Failed to generate QR code")
    }
}