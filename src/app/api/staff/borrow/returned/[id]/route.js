import { NextResponse, NextRequest } from "next/server";
import axios from "axios";

export async function PUT(req, context) {
    try {
        const token = req.cookies.get('token')?.value;
        const { actual_return_date, return_condition, penalty_amount, penalty_paid } = await req.json();
        const params = await context.params;
        const borrowId = params?.id;
        const returnUpdateApi = process.env.STAFF_BORROW_CONFIRM_RETURN_API;
        const apiUrl = returnUpdateApi.replace("{id}", encodeURIComponent(borrowId));
        const response = await axios.put(apiUrl,
            {
                actual_return_date,
                return_condition,
                penalty_amount,
                penalty_paid
            }, {
            headers: { Authorization: `Bearer ${token}`, }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("return update error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}