import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const floorListApi = process.env.FLOOR_LIST_API;
        const response = await axios.get(floorListApi, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("floor list error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { floors } = await req.json();
        const floorCreateApi = process.env.FLOOR_CREATE_API;
        const response = await axios.post(floorCreateApi, floors, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("create floor error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}