import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function GET(req, context) {
    try {
        const token = req.cookies.get("token")?.value;
        const params = await context.params;
        const equipmentId = params?.id;
        const getEquipmentByIdApi = process.env.STAFF_EQUIPMENT_BY_ID_API;
        const apiUrl = getEquipmentByIdApi.replace("{id}", encodeURIComponent(equipmentId));
        const response = await axios.get(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result.data, { status: 200 });
    } catch (error) {
        console.error("get equipment by id error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req, context) {
    try {
        const token = req.cookies.get("token")?.value;
        const params = await context.params;
        const equipmentId = params?.id;
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
        apiFormData.append('requires_approval', formData.get('requires_approval') || null);
        apiFormData.append('is_active', formData.get('is_active') || null);

        if (imageFile) {
            apiFormData.append('image', imageFile);
        }
        const updateEquipmentApi = process.env.STAFF_EQUIPMENT_UPDATE_API;
        const apiUrl = updateEquipmentApi.replace("{id}", encodeURIComponent(equipmentId));
        const response = await axios.put(apiUrl, apiFormData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("update equipment error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req, context) {
    try {
        const token = req.cookies.get("token")?.value;
        const params = await context.params;
        const equipmentId = params?.id;
        const deleteEquipmentApi = process.env.STAFF_EQUIPMENT_DELETE_API;
        const apiUrl = deleteEquipmentApi.replace("{id}", encodeURIComponent(equipmentId));
        const response = await axios.delete(apiUrl, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("delete equipment error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}