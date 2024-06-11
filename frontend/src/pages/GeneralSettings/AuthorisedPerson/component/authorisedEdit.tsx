import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const personEdit = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [nid, setNid] = useState("");
    const [signature, setSignature] = useState<File | null>(null)
    // const [oldsignature, setOldSignature] = useState<File | null>(null);
    // const [dusignature, setDUSignature] = useState<string[]>([]);


    const params = useParams();
    const navigate = useNavigate();

    const getCostingDetails = async()=>{
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }

        await axios.get(`http://localhost:8080/bmitvat/api/authorised_person/get_person/${params.id}`,{headers})
            .then((response) => {
                const data = response.data;
                setName(data.personName)
                setDescription(data.description)
                setPhone(data.phoneNumber)
                setEmail(data.emailAddress)
                setNid(data.nidNumber)
                setSignature(data.signature)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
        }
    }

    useEffect(()=>{
      getCostingDetails();   //create this function
    },[])  

    const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const isFile = signature instanceof File;
      if(isFile){
        console.log("This is File");
        const person = {
          personName: name,
          description: description,
          phoneNumber: phone,
          emailAddress: email,
          nidNumber: nid,
          signature: signature,
          createdBy: '1',
        }
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}`, 'Content-Type': 'multipart/form-data' }


        try {
           await axios.put(`http://localhost:8080/bmitvat/api/authorised_person/update_person/${params.id}`, person, {headers})
          .then(function (response){
            if(response){
              navigate("/pages/settings/authorised_person/index");
            }
          })

        } catch (err) {
          console.log(err);
        }
        }
      }else{
        console.log("This is Not a File");
        const imageTag = document.getElementById('myImage') as HTMLImageElement | null;
        if (imageTag) {
            const src = imageTag.src;
            const img_name=src.split('/').pop();
  
            const response = await fetch(src);
            const blob = await response.blob();
            const fileExtension = src.split('.').pop() || 'jpg';
            const file = new File([blob], `${img_name}`, { type: `image/${fileExtension}` });


            const person = {
              personName: name,
              description: description,
              phoneNumber: phone,
              emailAddress: email,
              nidNumber: nid,
              signature: file,
              createdBy: '1'
            }
            const token = localStorage.getItem('Token');
            if(token){
                const bearer = JSON.parse(token);
                const headers= { Authorization: `Bearer ${bearer}`, 'Content-Type': 'multipart/form-data' }
    
    
            try {
               await axios.put(`http://localhost:8080/bmitvat/api/authorised_person/update_person/${params.id}`, person, {headers})
              .then(function (response){
                if(response){
                  navigate("/pages/settings/authorised_person/index");
                }
              })
    
            } catch (err) {
              console.log(err);
            }
            }
        }

      }

      };


  return (
    <div>
    <div id="form">
            <div className="flex items-center justify-between mb-6">
                <h5 className="font-semibold text-lg dark:text-white-light">Authorised Person Edit</h5>
            </div>
            <div className="mb-5 ">
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Name
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={name} onChange={(e) => setName(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Description
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Phone
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Email
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person NID
                        </label>
                        <input id="PersonName" type="text" placeholder="Enter Person Name" className="form-input flex-1" 
                         name = "Person_name" value={nid} onChange={(e) => setNid(e.target.value)} required />
                    </div>
                    <div className="flex sm:flex-row flex-col">
                        <label htmlFor="PersonName" className="mb-0 sm:w-1/4 sm:ltr:mr-1 rtl:ml-2" >
                          Person Signature
                        </label>
                        <div className="flex sm:flex-row flex-col">
                           <input id="PersonName" type="file" placeholder="Enter Person Name" className="form-input flex-1 " 
                            name = "Person_name"  onChange={(e) => setSignature(e.target.files![0])} />
                           <img id="myImage" src={'/assets/images/authorised_person/'+ signature} className="h-16 w-auto" />
                         </div>
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
export default personEdit;