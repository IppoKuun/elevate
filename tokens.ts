import crypto from "crypto";

export function generateInviteToken(){
    const token = crypto.randomBytes(32).toString("base64url")
    return token
}

export function sha256(input: string){
    return crypto.createHash("sha256").update(input).digest("hex")
}