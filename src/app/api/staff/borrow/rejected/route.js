import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const borrowListApi = process.env.STAFF_BORROW_LIST_API;
        const response = await axios.get(borrowListApi, {
            params: { borrow_status: 'rejected' },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("get borrow rejected list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}