import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../../components/Icon/IconFile';
import IconTrashLines from '../../../../components/Icon/IconTrashLines';
import axios from 'axios';


const costingEdit = () => {
    const [costing_name,setName]=useState("");
    const [costing_type,setType]=useState("");
    const params = useParams();
    const navigate = useNavigate();

    const getCostingDetails = async()=>{
        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }

        await axios.get(`http://localhost:8080/bmitvat/api/costing/get_costing/${params.id}`,{headers})
            .then((response) => {
                // setInitialRecords(response.data);
                const data = response.data;
                console.log(data);
                setName(data.costingName)
                setType(data.costingType)

            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
        }
    }
    useEffect(()=>{
      getCostingDetails();   //create this function
    },[])  //Use array
    const handleSubmit = async () => {
        const costing = {
          costingName: costing_name,
          costingType:costing_type,
          createdBy: '1',
        }

        const token = localStorage.getItem('Token');
        if(token){
            const bearer = JSON.parse(token);
            const headers= { Authorization: `Bearer ${bearer}` }


        try {
            console.log(costing);
           await axios.put(`http://localhost:8080/bmitvat/api/costing/update_costing/${params.id}`, costing, {headers})
          .then(function (response){
            if(response){
              navigate("/pages/settings/costing");
            }
          })
          // if(response.status==200){
          // }else{
          //   console.warn("Insert Unsuccessfull");
          //   navigate("/pages/settings/unit/add");
          // }
        } catch (err) {
          console.log(err);
        }
        }
      };


  return (
    <div>
      <div className="panel flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl">Costing</h2>
      </div>
      <div className="panel mt-6">
        {/* Grid */}
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Edit Costing</h3>
          </div>
          <div className="mb-5">
            {/*
            <form className="space-y-5" onSubmit={handleSubmit}> */}
            <form className="space-y-5">
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="costingName" className='col-span-1 text-base'>Costing Name</label>
                  <input id="costingName" type="text" placeholder="Enter Costing Name" className="form-input py-2.5 text-base col-span-4" name ="costing_name" value={costing_name} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="costingType" className='col-span-1 text-base'>Costing Type</label>
                  <select className="form-select text-dark col-span-4 text-base" value={costing_type} onChange={(e) => setType(e.target.value)} name ="costing_type" required>
                    <option value="" disabled>Select One</option>
                    <option value="1">Direct Cost</option>
                    <option value="0">Indirect Cost</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6 pt-8">
                <button type="submit" className="btn btn-success gap-2" onClick={handleSubmit}>
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to={"/pages/settings/costing"} >
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
    </div>
  )
}
export default costingEdit;