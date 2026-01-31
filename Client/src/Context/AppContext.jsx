import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";

export const AppContext=createContext();

export const AppContextProvider=({children})=>{

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [token,setToken]=useState(localStorage.getItem('rf_token')?localStorage.getItem('rf_token'):null)
    const [userData,setUserData]=useState(null)
    const [loading, setLoading] = useState(true);
      const [resumes, setResumes] = useState([]);
      const [jobDescription, setJobDescription] = useState("");
         const [selectedResumeId, setSelectedResumeId] = useState("");

      


    const fetchUser = async()=>{
        const {data}= await axios.get(backendUrl+'/api/user/get',{headers:{Authorization:`Bearer ${token}`}})
       try {
         if(data.success) setUserData(data.user)
       } catch (error) {
        console.log(error);
        
       }
        finally {
    setLoading(false);
  }
    }

     const fetchResumes = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/ai/my-resumes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (data.success) {
          setResumes(data.resumes);
        }
      } catch (error) {
        console.error("Failed to fetch resumes", error);
      }
    };

    useEffect(()=>{
          if (token) {
      fetchUser();
    } else {
      setUserData(null);
      setLoading(false);
    }
  }, [token, backendUrl]);


    const value={backendUrl,token,setToken,userData,setUserData,loading
      ,jobDescription,setJobDescription,setLoading,fetchResumes,setResumes,resumes,selectedResumeId,setSelectedResumeId}
    return(
    <AppContext.Provider value={value}>{children}</AppContext.Provider>
    )
}

