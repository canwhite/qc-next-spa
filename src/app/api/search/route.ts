import {NextResponse } from 'next/server';

async function handler(req:Request) {
    if (req.method === 'POST') {
      try {
          //query去请求
          const params =  await req.json();
          const response = await fetch('http://127.0.0.1:7500/gen_res', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(params),
          });
  
          const data = await response.json();
          return NextResponse.json({ body: data,status:200 });
      } catch (error) {
          return NextResponse.json({ body: "error" ,status: 500});
      }
    } else {
          return NextResponse.json({ body: "Method Not Allowed",status: 405 });
    }
  }
  
  export const POST = handler;