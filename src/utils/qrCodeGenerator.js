import QRCode from "qrcode"

export const generateQRCode = async(certificateId) => {
    try {
    //TODO: Replace this with deployed frontend URL from frontend track 
    const verificationUrl = `http://localhost:3000/api/v1/certificates/verify/${certificateId}`;

    // Generate QR code as a Base64 Data URL
    const qrCode = await QRCode.toDataURL(verificationUrl);

    return qrCode;

    } catch (error) {
        throw new Error("Failed to generate QR code")
    }
}