import { NextResponse, NextRequest } from "next/server";
import axios from "axios";
import { headers } from "next/headers";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const { description, floor_number, building_id, is_active } = await req.json();
        const params = await context.params;
        const floorId = params?.id;
        const floorUpdateApi = process.env.FLOOR_UPDATE_API;
        const apiUrl = floorUpdateApi.replace("{id}", encodeURIComponent(floorId));
        const response = await axios.put(apiUrl,
            { description, floor_number, building_id, is_active }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update floor error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = context.params;
        const floorId = params?.id;
        const floorDeleteApi = process.env.FLOOR_DELETE_API;
        const apiUrl = floorDeleteApi.replace("{id}", encodeURIComponent(floorId));
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete floor error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}