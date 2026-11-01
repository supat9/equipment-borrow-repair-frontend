import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const buildingId = params?.id;
        const floorListByBuildingApi = process.env.FLOOR_LIST_BY_BUILDING_API;
        const apiUrl = floorListByBuildingApi.replace("{id}", encodeURIComponent(buildingId));
        const response = await axios.get(apiUrl, {
            headers: {Authorization: `Bearer ${token}`}
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("floor list building error:", error.message);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}