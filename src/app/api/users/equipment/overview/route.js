import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { searchParams } = new URL(req.url);
        const equipment_name = searchParams.get("equipment_name") || '';
        const category_name = searchParams.get("category_name") || '';
        const overviewApi = process.env.EQUIPMENT_OVERVIEW_API;
        const response = await axios.get(overviewApi, {
            params: { equipment_name, category_name },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("get category error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}