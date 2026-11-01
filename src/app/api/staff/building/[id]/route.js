import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const buildingId = params?.id;
        const buildingDeleteApi = process.env.BUILDING_DELETE_API;
        const apiUrl = buildingDeleteApi.replace("{id}", encodeURIComponent(buildingId));
        const response = await axios.delete(apiUrl, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete building error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const { buildingCode, buildingName, description, isActive } = await req.json();
        const params = await context.params;
        const buildingId = params?.id;
        const buildingUpdateApi = process.env.BUILDING_UPDATE_API;
        const apiUrl = buildingUpdateApi.replace("{id}", encodeURIComponent(buildingId));
        const response = await axios.put(apiUrl, {
            buildingCode,
            buildingName,
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