import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongoose';
import { ImageTo3DHistory, TextTo3DHistory } from '@/models/History';
import { Types } from 'mongoose';

interface ModelDocument {
  _id: any;
  userId: string;
  thumbnailUrl: string;
  modelUrl: string;
  status: string;
  createdAt: any;
  taskError?: {
    message: string;
  };
  prompt?: string;
  negativePrompt?: string;
  artStyle?: string;
}

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch both types of history
    const [rawImageHistory, rawTextHistory] = await Promise.all([
      ImageTo3DHistory.find({ userId }).sort({ createdAt: -1 }).lean(),
      TextTo3DHistory.find({ userId }).sort({ createdAt: -1 }).lean()
    ]);

    console.log('Raw Image History:', JSON.stringify(rawImageHistory, null, 2));
    console.log('Raw Text History:', JSON.stringify(rawTextHistory, null, 2));

    // Transform the histories
    const transformedImageHistory = rawImageHistory.map(model => {
      console.log('Processing image model:', model);
      return {
        id: model._id?.toString() || model._id,
        type: 'image-to-3d' as const,
        thumbnail_url: model.thumbnailUrl || '',
        model_urls: {
          glb: model.modelUrl || '',
          obj: (model.modelUrl || '').replace('.glb', '.obj'),
          fbx: (model.modelUrl || '').replace('.glb', '.fbx'),
          usdz: (model.modelUrl || '').replace('.glb', '.usdz')
        },
        status: model.status || 'UNKNOWN',
        created_at: model.createdAt ? new Date(model.createdAt).getTime() : Date.now(),
        task_error: model.taskError
      };
    });

    const transformedTextHistory = rawTextHistory.map(model => {
      console.log('Processing text model:', model);
      return {
        id: model._id?.toString() || model._id,
        type: 'text-to-3d' as const,
        prompt: model.prompt || '',
        negative_prompt: model.negativePrompt,
        art_style: model.artStyle,
        thumbnail_url: model.thumbnailUrl || '',
        model_urls: {
          glb: model.modelUrl || '',
          obj: (model.modelUrl || '').replace('.glb', '.obj'),
          fbx: (model.modelUrl || '').replace('.glb', '.fbx'),
          usdz: (model.modelUrl || '').replace('.glb', '.usdz')
        },
        status: model.status || 'UNKNOWN',
        created_at: model.createdAt ? new Date(model.createdAt).getTime() : Date.now(),
        task_error: model.taskError
      };
    });

    // Combine and sort by creation date
    const allModels = [...transformedImageHistory, ...transformedTextHistory]
      .sort((a, b) => b.created_at - a.created_at);

    console.log('Final transformed models:', JSON.stringify(allModels, null, 2));
    return NextResponse.json({ models: allModels });
  } catch (error) {
    console.error('Error fetching model history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch model history' },
      { status: 500 }
    );
  }
} 