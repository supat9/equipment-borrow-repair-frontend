import { NextResponse, NextRequest } from "next/server";
import axios from "axios";


export async function POST(req) {
    try {
        const { borrowDate, expectedReturnDate, purpose, item } = await req.json();
        const token = req.cookies.get("token")?.value;
        const borrowCreateApi = process.env.BORROW_CREATE_API;
        const response = await axios.post(borrowCreateApi,
            { borrowDate, expectedReturnDate, purpose, item }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const result = response.data;
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("create borrow error:", error);
        if (error.response) return NextResponse.json(error.response.data, { status: error.response.status });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}