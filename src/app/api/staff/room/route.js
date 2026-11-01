import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const roomListApi = process.env.ROOM_LIST_API;
        const response = await axios.get(roomListApi, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("room list error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { room_type_id, room_number, floor_id, room_name, description, is_active } = await req.json();
        const roomCreateApi = process.env.ROOM_CREATE_API;
        const response = await axios.post(roomCreateApi, {
            room_type_id,
            room_number,
            floor_id,
            room_name,
            description,
            capacity: 50,
            is_active
        }, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("create room error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
