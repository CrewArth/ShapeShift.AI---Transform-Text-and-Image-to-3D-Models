import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs'
import { ObjectId } from 'mongodb'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Fetch the specific model
    const model = await db.collection('models').findOne({
      _id: new ObjectId(params.id),
      isPublic: true
    })

    if (!model) {
      return NextResponse.json(
        { error: 'Model not found' },
        { status: 404 }
      )
    }

    // Transform _id to string id for client
    const transformedModel = {
      ...model,
      id: model._id.toString(),
      _id: undefined
    }

    return NextResponse.json({ model: transformedModel })
  } catch (error) {
    console.error('Error fetching model:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 