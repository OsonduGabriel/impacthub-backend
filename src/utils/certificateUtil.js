import {customAlphabet} from "nanoid"

//creating  ID generator - uses only uppercase letters and numbers - 8 characters
const nanoid = customAlphabet(
    "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    8
)

//generate certificate ID - format: IH-2026-8G7K2M4P
export const generateCertificateId = () => {
    const year = new Date().getFullYear()

    return `IH-${year}-${nanoid()}`
}