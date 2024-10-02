import prisma from './prisma';
import redis from './redis';
import { getVoteCountKey, getVoteTypeKey } from './redisKeys';

// setting time to clear redis
export const CACHE_TTL = 600;

// Update vote counts to db
export async function cronJobToSyncVoteCountToDB() {
  try {
    const simulationKeys = await redis.keys(getVoteCountKey());
    for (const key of simulationKeys) {
      const simulationId = key.split(':')[1];
      const voteCount = await redis.get(key);
      if (voteCount !== null) {
        await prisma.simulation.update({
          where: { id: Number(simulationId) },
          data: { voteCount: parseInt(voteCount, 10) },
        });
      }
    }
  } catch (error) {
    console.error('Error syncing vote count to DB:', error);
  }
}

// updating/adding record on Vote table on like/unlike
export async function cronJobToSyncVoteTableToDB() {
  try {
    const voteTypeKeys = await redis.keys(getVoteTypeKey());
    for(const key of voteTypeKeys) {
      const simulationId = key.split(':')[1];
      const userId = key.split(':')[2];
      const cachedVoteType = await redis.get(key)
      if(simulationId !== null && userId !== null) {
        const existingVote = await prisma.vote.findFirst({
          where: {
            simulationId: parseInt(simulationId,10),
            userId: userId,
          },
        });
        if(existingVote && cachedVoteType) {
          if(existingVote.voteType != parseInt(cachedVoteType,10)){
            await prisma.vote.update({
              where: {
                id: existingVote.id,
              },
              data: {
                voteType: parseInt(cachedVoteType,10),
              },
            });
          }
        }else{
          if(cachedVoteType){
            await prisma.vote.create({
              data: {
                simulationId: parseInt(simulationId,10),
                userId: userId,
                voteType: parseInt(cachedVoteType,10),
              },
            });
          }
        }
      }
    }
  }catch (error) {
    console.error('Error syncing vote table:', error);
  }
}

