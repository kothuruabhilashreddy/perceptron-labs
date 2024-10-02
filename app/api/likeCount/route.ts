import { NextResponse } from 'next/server';
import redis from '@/app/_lib/redis';
import { getVoteCountKey, getVoteTypeKey } from '@/app/_lib/redisKeys';
import { CACHE_TTL, cronJobToSyncVoteCountToDB, cronJobToSyncVoteTableToDB } from '@/app/_lib/cron-job';

interface VoteRequestBody  {
  simulationId: number,
  userId: string,
  voteType: number
}

export async function POST(req: Request) {
  const { simulationId, userId, voteType } = (await req.json()) as VoteRequestBody;
  try {
      await redis.set(getVoteTypeKey(simulationId, userId), voteType, 'EX', CACHE_TTL);
      if(voteType) {
          await redis.incr(getVoteCountKey(simulationId)); 
          await redis.expire(getVoteCountKey(simulationId), CACHE_TTL);
      }else{
          await redis.decr(getVoteCountKey(simulationId)); 
          await redis.expire(getVoteCountKey(simulationId), CACHE_TTL);
      }
      //cronJobs to update DB, will handle for recurrently if cron-job is integrated.
      cronJobToSyncVoteCountToDB();
      cronJobToSyncVoteTableToDB();
      const currVoteCount = await redis.get(getVoteCountKey(simulationId));
      const currVoteType = await redis.get(getVoteTypeKey(simulationId, userId))
      return NextResponse.json({currVoteCount, currVoteType}, { status: 201 });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
      return NextResponse.json({ error: 'Failed to update like/unlike action' }, { status: 500 });
  } 
}
