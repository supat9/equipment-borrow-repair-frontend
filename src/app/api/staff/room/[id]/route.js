import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { ca } from "date-fns/locale";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const roomId = params?.id;
        const { room_type_id, room_number, floor_id, room_name, description, is_active } = await req.json();
        const roomUpdateApi = process.env.ROOM_UPDATE_API;
        const apiUrl = roomUpdateApi.replace("{id}", encodeURIComponent(roomId));
        const response = await axios.put(apiUrl, {
            room_type_id,
            room_number,
            floor_id,
            room_name,
            description,
            is_active
        }, { headers: { Authorization: `Bearer ${token}` } });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update room error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = context.params;
        const roomId = params?.id;
        const roomDeleteApi = process.env.ROOM_DELETE_API;
        const apiUrl = roomDeleteApi.replace("{id}", encodeURIComponent(roomId));
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete room error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}