// app/api/admin/users/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getCollection } from '@/lib/db/mongo';

interface User {
  _id?: any;
  email: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Check authentication
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const collection = await getCollection<User>('users');

    // Get total users
    const total = await collection.countDocuments();

    // Get admin users
    const admins = await collection.countDocuments({ role: 'admin' });

    // Count recent signups (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentSignups = await collection.countDocuments({
      createdAt: { $gte: weekAgo },
    });

    return NextResponse.json({
      total,
      active: total, // For now, assume all users are active
      admins,
      recentSignups,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user statistics' },
      { status: 500 },
    );
  }
}
