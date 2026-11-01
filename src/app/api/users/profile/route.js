import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        /* 1. */
        const token = req.cookies.get('token')?.value;
        /* 2. */
        // const token = req.headers.get('Authorization')?.replace('Bearer ', '');
        const profileApi = process.env.PROFILE_API;
        const response = await axios.get(profileApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Profile error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}