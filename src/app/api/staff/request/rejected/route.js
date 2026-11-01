import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { searchParams } = new URL(req.url);
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const staffRequestListApi = process.env.STAFF_REQUEST_LIST_API;
        const response = await axios.get(staffRequestListApi, {
            params: {
                page, limit,
                request_status: 'rejected'
            },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Request rejected list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}