import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function POST(req) {
    try {
        const res = NextResponse.json({ message: "Logout success" }, { status: 200 });
        res.cookies.set('token', '', {
            httpOnly: true,
            path: '/',
            maxAge: 0,
            sameSite: 'lax',
        });
        return res;
    } catch (error) {
        console.error("Logout error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

