// file to fetch the keys for redis
export const getVoteCountKey = (simulationId ?: number) => {
    if(simulationId)
        return `simulationVoteCount:${simulationId}`;
    else
        return 'simulationVoteCount:*'
}

export const getVoteTypeKey = (simulationId ?: number, userId?: string) => {
    if(simulationId && userId)
        return `userVote:${simulationId}:${userId}`;
    else
        return 'userVote:*';
}
