import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const requestListApi = process.env.REQUEST_LIST_API;
        const response = await axios.get(requestListApi, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: { request_status: 'cancelled' }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("Request confirmed error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const { id, comment } = await req.json();
        const cancelledRequestApi = process.env.REQUEST_CANCEL_API;
        const response = await axios.post(`${cancelledRequestApi}/${id}`, { comment }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Request cancelled error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}