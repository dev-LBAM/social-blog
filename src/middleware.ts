import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if((accessToken || refreshToken) && request.nextUrl.pathname === '/') 
  {
    return NextResponse.redirect(new URL('/feed', request.url))
  }
  else if((!accessToken && !refreshToken) && request.nextUrl.pathname === '/feed')
  {

  }
  

  return NextResponse.next();
}


export const config = {
  matcher: ['/', '/feed'],
};
