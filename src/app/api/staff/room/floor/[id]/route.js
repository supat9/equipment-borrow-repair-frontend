import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const floorId = params?.id;
        const roomListByFloorApi = process.env.ROOM_LIST_BY_FLOOR_API;
        const apiUrl = roomListByFloorApi.replace("{id}", encodeURIComponent(floorId));
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("room list by floor error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}