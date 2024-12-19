import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongoose';
import UserCredits from '@/models/UserCredits';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch user credits document which contains transactions
    const userCredits = await UserCredits.findOne({ userId });
    if (!userCredits) {
      return NextResponse.json({ transactions: [] });
    }

    // Sort transactions by timestamp (newest first)
    const transactions = userCredits.transactions.sort((a: any, b: any) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transaction history' },
      { status: 500 }
    );
  }
} 