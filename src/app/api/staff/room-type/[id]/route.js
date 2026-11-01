import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const roomTypeId = params?.id;
        const roomTypeDeleteApi = process.env.ROOM_TYPE_DELETE_API;
        const apiUrl = roomTypeDeleteApi.replace("{id}", encodeURIComponent(roomTypeId));
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete room type error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const { roomTypeName, description, isActive } = await req.json();
        const params = await context.params;
        const roomTypeId = params?.id;
        const roomTypeUpdateApi = process.env.ROOM_TYPE_UPDATE_API;
        const apiUrl = roomTypeUpdateApi.replace("{id}", encodeURIComponent(roomTypeId));
        const response = await axios.put(apiUrl, {
            roomTypeName,
            description,
            isActive
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update building error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}