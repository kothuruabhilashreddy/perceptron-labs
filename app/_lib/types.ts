export type simulationProps = {
    id: number
    title: string
    userName: string
    comment: string
    voteCount: number
    createdAt: Date
}

export type simulationItemProps = simulationProps & {
    userVote?: number
    userId?: string
}