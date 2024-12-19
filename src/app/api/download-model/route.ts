import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const format = searchParams.get('format');

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    // Extract the original URL if it's already proxied
    const originalUrl = url.startsWith('/api/proxy') ? 
      decodeURIComponent(url.split('url=')[1]) : 
      url;

    // Replace the extension based on the requested format
    const formatUrl = originalUrl.replace(/\.[^/.]+$/, `.${format}`);

    // Create headers for Meshy API
    const headers: Record<string, string> = {
      'Accept': '*/*',
    };
    
    if (formatUrl.includes('meshy.ai')) {
      const apiKey = process.env.MESHY_API_KEY;
      if (!apiKey) {
        throw new Error('MESHY_API_KEY not configured');
      }
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(formatUrl, { 
      headers,
      redirect: 'follow',
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';

    return new NextResponse(blob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename=model.${format}`,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000'
      }
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to download model' },
      { status: 500 }
    );
  }
} 