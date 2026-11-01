import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const roomTypeListApi = process.env.ROOM_TYPE_LIST_API;
        const response = await axios.get(roomTypeListApi, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("room type list error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { roomTypeName, description, isActive } = await req.json();
        const roomTypeCreateApi = process.env.ROOM_TYPE_CREATE_API;
        const response = await axios.post(roomTypeCreateApi, {
            roomTypeName,
            description,
            isActive
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("room type create error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}