import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const personAdd = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [nid, setNid] = useState("");
    const [signature, setSignature] = useState<File | null>(null)

    const navigate = useNavigate();
  
    useEffect(() => {
      handleSubmit;
  }, []);
  
    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      const person = {
        personName: name,
        description: description,
        phoneNumber: phone,
        emailAddress: email,
        nidNumber: nid,
        signature: signature,
        createdBy: '1',
      }

    //   console.log(costing);
  
      const token = localStorage.getItem('Token');
      if(token){
        const bearer1 = JSON.parse(token);
      const headers= { Authorization: `Bearer ${bearer1}`, 'Content-Type': 'multipart/form-data' }
  
      try {
         await axios.post("http://localhost:8080/bmitvat/api/authorised_person/add-person", person, {headers})
          .then(function (response) {
            if(response){
              navigate("/pages/settings/authorised_person/index");
                // console.log("Successfully Add");
            }else{
              navigate("/pages/settings/authorised_person/add");
            }
          })
  
      } catch (err) {
        console.log(err);
      }
    }
  
    };


    return (
        <div>
            <div id="form">
                    <div className="flex items-center justify-between mb-6">
                        <h5 className="font-semibold text-lg dark:text-white-light">Authorised Person Add</h5>
                    </div>
                    <div className="mb-5 ">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person Name
                                </label>
                                <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                                 name = "Person_name" onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person Description
                                </label>
                                <input id="PersonName" type="text" placeholder="Enter Person Description" className="form-input flex-1" 
                                 name = "Person_name" onChange={(e) => setDescription(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person Phone
                                </label>
                                <input id="PersonName" type="text" placeholder="Enter Person Phone" className="form-input flex-1" 
                                 onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person Email
                                </label>
                                <input id="PersonName" type="text" placeholder="Enter Person Email" className="form-input flex-1" 
                                  onChange={(e) => setEmail(e.target.value)} required />
                            </div>

                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person NID
                                </label>
                                <input id="PersonName" type="text" placeholder="Enter Person NID" className="form-input flex-1" 
                                  onChange={(e) => setNid(e.target.value)} required />
                            </div>
                            <div className="flex sm:flex-row flex-col">
                                <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                                  Person Signature
                                </label>
                                <input id="PersonName" type="file" placeholder="Enter Person Signature" className="form-input flex-1" 
                                  onChange={(e) => setSignature(e.target.files![0])} required />
                            </div>
                    
                            <div className="flex items-center justify-center gap-6 pt-9">
                               
                                    <button type="submit" className="btn btn-success gap-2">
                                        <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Submit
                                    </button>
                            
                                 <Link to={"/pages/settings/authorised_person/index"}>
                                    <button type="button" className="btn btn-danger gap-2" >
                                        <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
        </div>
    )
}
export default personAdd;