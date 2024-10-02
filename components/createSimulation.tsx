import { simulationItemProps } from "@/app/_lib/types";
import { Dispatch, SetStateAction, useState } from "react";

interface CreateSimulationProps {
    setSimulations: Dispatch<SetStateAction<simulationItemProps[]>>
}
export default function CreateSimulation({setSimulations} : CreateSimulationProps) {
    const [modelVisible, setModelVisible] = useState(false);
    const [validateFormError, setValidateForm] = useState(false);
    const [userName, setUserName] = useState('');
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    const isValidationError = async () => {
        if(userName.length == 0 || title.length == 0 || comment.length == 0)
            return true;
        return false;
    }
    const handleCancel = async () => {
        // Updating form to default state
        setModelVisible(false);
        setValidateForm(false);
        setUserName('');
        setTitle('');
        setComment('');
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(await isValidationError()){
            setValidateForm(true);
        }
        else{
            setValidateForm(false);
            const response = await fetch('/api/simulationItems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, title, comment }),
            });
            setModelVisible(false);
            const data = await response.json();
            if (response.ok && data) {
                setSimulations((prevState: Array<simulationItemProps>) => [data, ...prevState]); // Append the result at the front
              }
        }
    };


    return (
        <>
            {!modelVisible && <aside className="border-2 bg-gray-100 rounded-xl p-4 mt-4 mb-4 ">
                <div className="flex items-center justify-center">
                    <input className="border-2 border-gray-500 rounded-full p-2 flex-grow box-border bg-white-500 hover:bg-zinc-100" onFocus={() => setModelVisible(true)} placeholder="Create Post" required />
                </div>     
            </aside>}
            {modelVisible && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-100 rounded-lg p-4 mt-4 mb-4 shadow-lg max-w-md w-full">
                        <header>
                            <h2 className="text-xl font-bold mb-4">Add a new simulation idea</h2>
                            <hr className="mt-4"></hr>
                            {validateFormError && 
                                 <div className="bg-red-100 border border-l-4 border-red-400 text-red-700 px-2 py-1 rounded relative" role="alert">
                                 <strong className="font-bold">Required fields missing *</strong>
                               </div>}
                        </header>
                        <form className="flex gap-2 flex-col p-4">
                            <input className="p-2 rounded-xl border-2 border-gray-300" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="User Name *"/>
                            <input className="p-2 rounded-xl border-2 border-gray-300" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title *"/>
                            <textarea className="p-2 rounded-xl border-2 border-gray-300 h-32" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comment *" />
                            <div className="flex justify-end">
                                <button className=" rounded-full p-2 mx-1 mt-2 border-2 bg-white hover:bg-zinc-200 font-bold " onClick={() => handleCancel()}>Cancel</button>
                                <button className="rounded-full p-2 mx-1 mt-2 border-2 bg-blue-500 hover:bg-blue-600 text-white font-bold " type="submit" onClick={handleSubmit}>Submit</button>
                            </div>
                        </form>
                    </div>
            </div>}
      
        </>
    )
}