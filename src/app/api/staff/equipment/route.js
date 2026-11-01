import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const { searchParams } = new URL(req.url);
        const equipment_name = searchParams.get('equipment_name') || '';
        const category_name = searchParams.get('category_name') || '';
        const equipment_code = searchParams.get('equipment_code') || '';
        const page = searchParams.get('page');
        const limit = searchParams.get('limit');
        const equipmentListApi = process.env.STAFF_EQUIPMENT_LIST_API;
        const response = await axios.get(equipmentListApi, {
            params: { equipment_name, category_name, equipment_code, page, limit },
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("get equipment list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const token = req.cookies.get("token")?.value;
        const formData = await req.formData();
        const imageFile = formData.get('image');
        const apiFormData = new FormData();
        apiFormData.append('equipment_name', formData.get('equipment_name'));
        apiFormData.append('brand', formData.get('brand'));
        apiFormData.append('model', formData.get('model'));
        apiFormData.append('serial_number', formData.get('serial_number'));
        apiFormData.append('category_id', formData.get('category_id'));
        apiFormData.append('room_id', formData.get('room_id'));
        apiFormData.append('purchase_date', formData.get('purchase_date'));
        apiFormData.append('purchase_price', formData.get('purchase_price'));
        apiFormData.append('vendor', formData.get('vendor'));
        apiFormData.append('warranty_period', formData.get('warranty_period'));
        apiFormData.append('warranty_end_date', formData.get('warranty_end_date'));
        apiFormData.append('depreciation_rate', formData.get('depreciation_rate'));
        apiFormData.append('current_value', formData.get('current_value'));
        apiFormData.append('condition_status', formData.get('condition_status'));
        apiFormData.append('usage_status', formData.get('usage_status'));
        apiFormData.append('asset_group', formData.get('asset_group'));
        apiFormData.append('description', formData.get('description'));
        apiFormData.append('major_id', formData.get('major_id'));
        /* 3 อันนี้รอ */
        apiFormData.append('requires_approval', formData.get('requires_approval') || null);
        apiFormData.append('is_active', formData.get('is_active') || null);
        // apiFormData.append('set_id', formData.get('set_id') || null);
        if (imageFile) {
            apiFormData.append('image', imageFile);
        }
        const createEquipmentApi = process.env.STAFF_EQUIPMENT_CREATE_API;
        const response = await axios.post(createEquipmentApi,
            apiFormData,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("post equipment list error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}