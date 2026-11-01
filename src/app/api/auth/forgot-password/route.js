import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { email } = await req.json();
        // if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });
        const forgotPasswordApi = process.env.FORGOT_PASSWORD_API;
        const response = await axios.post(forgotPasswordApi, { email });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Reset password error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}