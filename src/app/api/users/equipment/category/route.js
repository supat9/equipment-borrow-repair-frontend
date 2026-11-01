import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get('token')?.value;
        const categoryApi = process.env.EQUIPMENT_CATEGORY_API;
        const response = await axios.get(categoryApi, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("get category error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}