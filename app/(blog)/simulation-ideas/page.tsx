"use client"
import SimulationItem from "@/components/simulationItem";
import { useEffect, useState } from "react";
import { simulationItemProps } from "@/app/_lib/types";
import CurrentUserId from "@/components/userId";
import CreateSimulation from "@/components/createSimulation";
import { overview_data, simulations_heading } from "@/app/_lib/constants";


export default function SimulationIdeas() {

  const [simulations, setSimulations] = useState<Array<simulationItemProps>>([]);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    setUserId(CurrentUserId())
  }, []);


  useEffect(() => {
    const fetchSimulations = async () => {  
      if(userId){
        const response = await fetch(`/api/simulationItems?userId=${userId}`);
        const data = await response.json();
        setSimulations(data);
      }
    };

    fetchSimulations();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userId])


  return (
    <>
      <div className="flex justify-center min-h-screen mt-4 mb-4 px-4 ">
        <div className="max-w-lg w-full">
          <p className="text-left mt-8">Simulation Ideas</p>
          <p className="text-left text-gray-600">Ishaan Sharma on Sep 17, 2024</p>
          <hr className="mt-4"></hr>
          <div className="mt-4 text-le ft">
            <div>
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <p className="mb-4">{overview_data}
                <a href="https://www.perceptron.so/blog/sim-world-whitepaper"
                 className="underline text-blue-600">whitepaper</a>.
              </p>
            </div>
            <header className="flex justify-between mt-8 mb-4">
              <h2 className="text-xl font-bold">Simulation Ideas</h2>
            </header>
            <p className="mb-4">{simulations_heading} </p>
            <CreateSimulation setSimulations={setSimulations} />
            {simulations?.map(item =>(
              <SimulationItem key={item.id} {...item} userId={userId} />
            ))}
          </div>
        </div>
        
      </div>
      
    </>
    
    
)
}