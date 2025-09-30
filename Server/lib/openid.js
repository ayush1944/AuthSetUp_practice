import { Issuer } from "openid-client";

let googleClient;

export async function getGoogleClient() {
  if (!googleClient) {
    const googleIssuer = await Issuer.discover("https://accounts.google.com");
    googleClient = new googleIssuer.Client({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uris: [`${process.env.BACKEND_URL}/api/auth/google/callback`],
      response_types: ["code"],
    });
  }
  return googleClient;
}