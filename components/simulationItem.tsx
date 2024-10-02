import { useState } from "react";
import { simulationItemProps } from "@/app/_lib/types";

export default function SimulationItem(item: simulationItemProps) {
    
    const {id, title, userName, comment, voteCount, userVote, userId} = item;
    const [currentVoteCount, setCurrentVoteCount] = useState(voteCount);
    const [currentUserVote, setCurrentUserVote] = useState(userVote);

    const handleVote = async (simulationId: number, voteType: number) => {
        const response = await fetch('/api/likeCount', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ simulationId, userId, voteType }),
        });
        const data = await response.json();
        setCurrentVoteCount(data.currVoteCount);
        setCurrentUserVote(data.currVoteType);
      };


    return (
        <aside className="border-l-4 border-gray-500 pl-4 py-2 mt-4 mb-4 bg-green-50">
            <div>
                <h2>{title}</h2>
                <p>{comment}</p>
                <div className={
                    `pt-1 pb-1 mt-1 text-12
                    inline-flex   
                    overflow-visible font-semibold  
                    items-center cursor-pointer rounded-full
                    border-2 border-gray-500
                    ${(currentUserVote == 1)? 'bg-blue-400 hover:bg-white': 'bg-white hover:bg-blue-400'}`}
                    onClick={() => handleVote(id, (currentUserVote==1) ? 0 : 1)}
                    >
                    <div className="mx-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            width={20}
                            height={20}
                            viewBox="0 0 511.947 511.947"
                        >
                            <path d="M476.847 216.373 263.513 3.04c-4.267-4.053-10.88-4.053-15.04 0L35.14 216.373c-4.16 4.16-4.16 10.88-.107 15.04 2.027 2.027 4.8 3.2 7.573 3.2h128V501.28c0 5.867 4.8 10.667 10.667 10.667h149.333c5.867 0 10.667-4.8 10.667-10.667V234.613h128c5.867 0 10.667-4.8 10.667-10.667 0-2.879-1.067-5.546-3.093-7.573zm-146.24-3.093c-5.867 0-10.667 4.8-10.667 10.667v266.667h-128V223.947c0-5.867-4.8-10.667-10.667-10.667H68.42L255.94 25.547 443.567 213.28h-112.96z" />
                        </svg>
                    </div>
                    <div className="mr-2">{currentVoteCount}</div>
                </div>
            </div>
        </aside>
    )
}