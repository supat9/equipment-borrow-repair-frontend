import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const { rejection_reason } = await req.json();
        const params = await context.params;
        const borrowId = params?.id;
        const rejectUpdateApi = process.env.STAFF_BORROW_REJECT_API;
        const apiUrl = rejectUpdateApi.replace("{id}", encodeURIComponent(borrowId));
        const response = await axios.put(apiUrl, { rejection_reason }, {
            headers: { Authorization: `Bearer ${token}`, }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("reject update error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}