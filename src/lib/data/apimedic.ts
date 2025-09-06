"use server";
import CryptoJS from "crypto-js";
import { NextResponse } from "next/server";
import { json } from "stream/consumers";

export default async function medicAuthToken() {
  const uri = "https://sandbox-authservice.priaid.ch/login";
  const secretKey = process.env.NEXT_PUBLIC_API_MEDIC_SECRET_KEY;
  const computedHash = CryptoJS.HmacMD5(uri, secretKey!);
  const computedHashString = computedHash.toString(CryptoJS.enc.Base64);

  const response = await fetch("https://sandbox-authservice.priaid.ch/login", {
    next: { revalidate: 7200 },
    method: "POST",
    headers: {
      Authorization:
        "Bearer " +
        process.env.NEXT_PUBLIC_API_MEDIC_EMAIL +
        ":" +
        computedHashString,
    },
  });

  const data = await response.json();

  return data;
}
