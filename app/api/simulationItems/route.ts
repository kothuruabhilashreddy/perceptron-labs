import prisma from '@/app/_lib/prisma';
import { NextResponse } from 'next/server';
import redis from '@/app/_lib/redis';
import { simulationItemProps, simulationProps } from '@/app/_lib/types';

export async function POST(req: Request) {
    const { userName, title, comment } = (await req.json()) as simulationProps;

    try {
        const simulation = await prisma.simulation.create({
        data: {
            userName,
            title,
            comment,
        },
        });
        return NextResponse.json(simulation, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: `Failed to create post: ${error}` }, { status: 500 });
    } 
}


// Function to fetch simulations from DB
async function fetchSimulations() {
  const simulations = await prisma.simulation.findMany({
    include: {
      votes: true,
    },
    orderBy: [
      { voteCount: 'desc' },
      { createdAt: 'asc' }
    ],
  });
  return simulations;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    const simulations = await fetchSimulations();
    const updatedSimulations = await Promise.all(
      simulations.map(async (simulation: simulationItemProps) => {
        const cachedVoteCount = await redis.get(`simulationVoteCount:${simulation.id}`);
        const voteCount = cachedVoteCount ? parseInt(cachedVoteCount, 10) : simulation.voteCount;
        let userVote: number | null = null
        const redisVote = await redis.get(`userVote:${simulation.id}:${userId}`);
         
        if (redisVote) {
          userVote = parseInt(redisVote, 10);
        } else {
          const dbVote = await prisma.vote.findFirst({
            where: {
              simulationId: simulation.id,
              userId: userId,
            },
            select: {
              voteType: true,
            },
          });
          userVote = dbVote ? dbVote.voteType : null;
        }

        return {
          ...simulation,
          voteCount,
          userVote,
        };
      })
    );

    return NextResponse.json(updatedSimulations);
  } catch (error) {
    return NextResponse.json({ error: `Error fetching simulations ${error}` }, { status: 500 });
  }
}

