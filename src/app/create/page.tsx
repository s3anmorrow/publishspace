"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { sendJSONData } from "@/tools/Toolkit";
import LoadingOverlay from "@/tools/LoadingOverlay";

export default function Create() {

    const POST_URL:string = "/api/post";
    const router:AppRouterInstance = useRouter();

    // ----------------------------------- adding new course
    const onSubmit = async (e:any) => {
        setLoading(true);

        // send out JSON to server
        const responseData:{data:any, status:number}|null = await sendJSONData(POST_URL, { name:txtName, description:txtDescription, url:txtURL }, "POST", false);

        console.log(responseData);

        // error handling
        if (responseData && responseData.status == 200) {
            // success - navigate back to home page
            router.push("/");
        } else {
            // failure - show error message
            router.push("/error");
        }

    };

    // ----------------------------------- setting state variables
    const [txtName, setTxtName] = useState<string>("");
    const [txtDescription, setTxtDescription] = useState<string>("");  
    const [txtURL, setTxtURL] = useState<string>("");  
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <>
            <LoadingOverlay show={loading} bgColor="#035074" spinnerColor="#FFFFFF" />

            <div>
                <div className="py-4 text-accent font-bold text-xl">Add New Sample:</div>
                <div className="mt-2.5 mb-1">Name:</div>
                <div><input type="text" className="appearance-none bg-white rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none" value={txtName} onChange={(e:any) => setTxtName(e.target.value)} maxLength={50} /></div> 
                
                <div className="mt-2.5 mb-1">Description:</div>
                <div><textarea className="appearance-none bg-white rounded w-[500px] py-2 px-4 text-gray-700 leading-tight focus:outline-none" value={txtDescription} onChange={(e:any) => setTxtDescription(e.target.value)} maxLength={300} rows={5} /></div> 

                <div className="mt-2.5 mb-1">Link:</div>
                <div><input type="text" className="appearance-none bg-white rounded w-[500px] py-2 px-4 text-gray-700 leading-tight focus:outline-none" value={txtURL} onChange={(e:any) => setTxtURL(e.target.value)} maxLength={100} /></div> 
                
                <div className="mt-5">
                    <button className="bg-accent hover:bg-accent/50 text-white font-bold py-2 px-3 rounded mr-2" onClick={onSubmit}>Ok</button>
                    <Link href={"/"}><button  className="bg-accent hover:bg-accent/50 text-white font-bold py-2 px-3 rounded mr-1">Cancel</button></Link>
                </div>
            </div>
        </>
    );  
}