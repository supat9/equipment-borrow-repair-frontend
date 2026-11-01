import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { searchParams } = new URL(req.url);
        const period = searchParams.get('period') || '';
        const limit = searchParams.get('limit') || '';
        const borrowStatisticsApi = process.env.STAFF_DASHBOARD_BORROWS_STATISTICS_API;
        const response = await axios.get(borrowStatisticsApi, {
            params: { period, limit },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("dashboard summary error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}