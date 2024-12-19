import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db()
    
    // Fetch all public models
    const models = await db.collection('models')
      .find({ isPublic: true })
      .sort({ createdAt: -1 })
      .toArray()

    // Transform _id to string id for client
    const transformedModels = models.map(model => ({
      ...model,
      id: model._id.toString(),
      _id: undefined
    }))

    return NextResponse.json({ models: transformedModels })
  } catch (error) {
    console.error('Error fetching public models:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 