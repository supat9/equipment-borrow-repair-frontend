import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get("token")?.value;
        const params = await context.params;
        const requestId = params?.id;
        const { requestStatuses, comment } = await req.json();
        const staffRequestUpdateApi = process.env.STAFF_REQUEST_UPDATE_API;
        const apiUrl = staffRequestUpdateApi.replace("{id}", encodeURIComponent(requestId));
        const response = await axios.put(apiUrl,
            { requestStatuses, comment },
            { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update request error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}