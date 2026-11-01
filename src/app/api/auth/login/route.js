import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const { username, password } = await req.json();
        // if (!username || !password) return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        const loginApi = process.env.LOGIN_API;
        const response = await axios.post(loginApi, { username, password });
        const result = response.data;
        const res = NextResponse.json(result.data, { status: 200 });
        res.cookies.set('token', result.data.access_token, {
            httpOnly: true,
            path: '/',
            maxAge: 60 * 50,
            sameSite: 'lax',
        });
        return res;
    } catch (error) {
        console.error("Login error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

