// pages/api/verify-auth.ts
import { parseAuth } from '@/app/lib/utils/auths'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try 
  {
    const userId = await parseAuth(req)
    
    return NextResponse.json(userId)
  } 
  catch 
  {
    return NextResponse.json(
    { error: 'Unauthorized' }, 
    { status: 401 })
  }
}
