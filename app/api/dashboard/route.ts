import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { getDashboardData } from "@/lib/actions"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const data = await getDashboardData()

    if (!data) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[DASHBOARD_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 