import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req, context) {
    try {
        const token = req.cookies.get("token")?.value;
        const params = await context.params;
        const majorId = params?.id;
        const majorByIdApi = process.env.STAFF_MAJOR_BY_FACULTY_ID_API;
        const apiUrl = majorByIdApi.replace("{id}", encodeURIComponent(majorId));
        const response = await axios.get(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("major by id error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}