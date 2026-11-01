import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const categoryId = params.id
        const { categoryCode, categoryName, description, isActive } = await req.json();
        const updateEquipmentCategoryApi = process.env.STAFF_EQUIPMENT_CATEGORY_UPDATE_API;
        const apiUrl = updateEquipmentCategoryApi.replace('{id}', encodeURIComponent(categoryId));
        const response = await axios.put(apiUrl,
            { categoryCode, categoryName, description, isActive },
            {
                headers: { Authorization: `Bearer ${token}` },
            });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update equipment-category error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const params = await context.params;
        const categoryId = params.id;
        const deleteEquipmentCategoryApi = process.env.STAFF_EQUIPMENT_CATEGORY_DELETE_API;
        const apiUrl = deleteEquipmentCategoryApi.replace('{id}', encodeURIComponent(categoryId));
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete equipment-category error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}