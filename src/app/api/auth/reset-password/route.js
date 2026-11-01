import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { email, otp, newPassword } = await req.json();
        // if (!email || !otp || !newPassword) return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        const resetPasswordApi = process.env.RESET_PASSWORD_API;
        const response = await axios.post(resetPasswordApi, { email, otp, newPassword });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}