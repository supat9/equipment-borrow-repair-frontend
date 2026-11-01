import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const exportEquipmentApi = process.env.EQUIPMENT_EXPORT;

    const url = new URL(req.url);
    
    // Get query parameters
    const status = url.searchParams.get("status");
    const categoryId = url.searchParams.get("category_id");
    
    const queryParams = new URLSearchParams();
    const format = url.searchParams.get("format") || "csv";
    queryParams.set("format", format);

    // Add status parameter if provided
    if (status) {
      queryParams.set("status", status);
    }

    // Add category_id parameter if provided
    if (categoryId) {
      queryParams.set("category_id", categoryId);
    }
    
    // Add any other existing parameters
    for (const [key, value] of url.searchParams.entries()) {
      if (
        key !== "format" &&
        key !== "status" &&
        key !== "category_id"
      ) {
        queryParams.set(key, value);
      }
    }

    const apiUrl = `${exportEquipmentApi}?${queryParams.toString()}`;
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/csv, application/json",
      },
      responseType: "arraybuffer", // Important for binary/CSV data
    });

    if (format === "csv") {
      // Backend returns CSV as binary data
      return new NextResponse(response.data, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition":
            response.headers["content-disposition"] ||
            'attachment; filename="equipment_export.csv"',
          "Cache-Control": "no-cache",
        },
      });
    }

    // For preview mode (JSON)
    if (url.searchParams.get("preview") === "true") {
      // Convert buffer to string and parse JSON
      const jsonString = Buffer.from(response.data).toString("utf-8");
      const jsonData = JSON.parse(jsonString);
      return NextResponse.json(jsonData, { status: 200 });
    }

    return NextResponse.json(
      {
        success: false,
        message: "รองรับเฉพาะรูปแบบ CSV และ preview เท่านั้น",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Export equipment error:", error);

    if (error.response) {
      // Try to parse error response
      try {
        const errorString = Buffer.from(error.response.data).toString("utf-8");
        const errorData = JSON.parse(errorString);
        return NextResponse.json(errorData, { status: error.response.status });
      } catch (parseError) {
        return NextResponse.json(
          {
            success: false,
            message: "เกิดข้อผิดพลาดในการส่งออกข้อมูลครุภัณฑ์",
          },
          { status: error.response.status }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
