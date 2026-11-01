import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const equipment_name = searchParams.get('equipment_name');
        const token = req.cookies.get('token')?.value;
        const groupDetailApi = process.env.EQUIPMENT_GROUP_DETAILS_API;
        const response = await axios.get(groupDetailApi, {
            params: { equipment_name },
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data.individual_items, { status: 200 });
    } catch (error) {
        console.error("group-detail error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}