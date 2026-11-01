import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const usageStatusApi = process.env.USAGE_STATUS_API;
        const response = await axios.get(usageStatusApi, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result.statuses, { status: 200 });
    } catch (error) {
        console.error("status urgency level error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}