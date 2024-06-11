import React, { useState,useEffect } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import IconFile from '../../../components/Icon/IconFile';
import IconTrashLines from '../../../components/Icon/IconTrashLines';
import axios from 'axios';


const editItem = () => {
  const [itemName, setName] = useState("");
  const [unitId, setUnit] = useState("");
  const [hsCodeId, setHscodeId] = useState("");
  const [itemType, setType] = useState("");
  const [status, setStatus] = useState("");

  interface units {
    id: number;
    unitName: string;
  }
  interface Hscode {
    id: number;
    hsCode: string;
    description: string;
    descriptionBn: string;
    calculateYear: string;
  }

const [allUnits, setGetAllUnits] = useState<units[]>([]);
const [allHscode, setGetAllHscode] = useState<Hscode[]>([]);

  const navigate = useNavigate();
  const params = useParams();


  useEffect(() => {
    const token = localStorage.getItem('Token');
    if(token){
        const bearer =  token.slice(1,-1); 
  
      const headers= { Authorization: `Bearer ${bearer}` }

            axios.get(`http://localhost:8080/bmitvat/api/item/get_item/${params.id}`,{headers})
            .then((response) => {
              const data = response.data;
              // console.log(data);
              setName(data.itemName)
              setUnit(data.unitId)
              setHscodeId(data.hsCodeId)
              setType(data.itemType)
              setStatus(data.status)
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
                // for units 
            axios.get('http://localhost:8080/bmitvat/api/unit/allunits',{headers})
            .then((response) => {
                setGetAllUnits(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
            //for hs_code
            axios.get('http://localhost:8080/bmitvat/api/hs_code/all_hs-code',{headers})
            .then((response) => {
                setGetAllHscode(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });
          }


    handleSubmit;
}, []);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const myArray = hsCodeId.split("/");
    const myArray1 = hsCodeId.split("#");

    const startIndex = hsCodeId.indexOf('/');
    const endIndex = hsCodeId.indexOf('#');
    //before '/'
    const hs_code_id = myArray[0];
    //Middle part
    const year = hsCodeId.substring(startIndex + 1, endIndex);
    //after '/'
    const hs_code = myArray1.slice(1).join("#");



    const items = {
      itemName: itemName,
      unitId: unitId,
      hsCode: hs_code,
      hsCodeId: hs_code_id,
      itemType: itemType,
      stockStatus: '0',
      status: status,
      calculateYear: year,
      createdBy: '0',
      updatedBy: '0'
    }

    const token = localStorage.getItem('Token');
    if(token){
      const bearer1 = JSON.parse(token);
    const headers= { Authorization: `Bearer ${bearer1}` }

    try {
       await axios.post("http://localhost:8080/bmitvat/api/item/add-item", items, {headers})
        .then(function (response) {
          if(response){
            navigate("/pages/inventory/items");
          }else{
            navigate("/pages/inventory/items/add");
          }
        })

    } catch (err) {
      console.log(err);
    }
  }

  
  };


  return (
    <div>
      <div className="panel flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-bold">Edit Item</h2>
      </div>
      <div className="panel mt-6">
        <div id="forms_grid">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-lg dark:text-white-light">Edit Item</h3>
          </div>
          <div className="mb-5">

            <form className="space-y-5" onSubmit={handleSubmit} >
              <div className="grid  gap-4">
                <div className="grid grid-cols-5 gap--x-2 gap-y-3">
                  <label htmlFor="unitName" className='col-span-1 text-base'>Item Name</label>
                  <input id="unitName" type="text" className="form-input py-2.5 text-base col-span-4" value={itemName} onChange={(e) => setName(e.target.value)} required />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Unit</label>
                  <select className="form-select text-dark col-span-4 text-base" value={unitId} onChange={(e) => setUnit(e.target.value)} required>
                    <option >Select Unit</option>
                    {allUnits.map((option, index) => (
                       <option key={index} value={option.id}>
                           {option.unitName}
                       </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>HS-CODE</label>
                  <select className="form-select text-dark col-span-4 text-base" value={hsCodeId} onChange={(e) => setHscodeId(e.target.value)} required>
                    <option >Select HS-CODE</option>
                    {allHscode.map((option, index) => (
                        <option key={index} value={option.id+'/'+option.calculateYear+'#'+option.hsCode}>
                            {option.hsCode + ' (' + option.descriptionBn +'/ '+ option.description +')'+ '('+ option.calculateYear +')'}
                        </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Item Type</label>
                  <select className="form-select text-dark col-span-4 text-base" value={itemType} onChange={(e) => setType(e.target.value)} required>
                    <option >Select Item Type</option>
                    <option value="1">Raw Materials</option>
                    <option value="2">Finish Goods</option>
                  </select>
                </div>
              </div>
              <div>
                <div className="grid grid-cols-5 gap--x-2 gap-y-3" >
                  <label htmlFor="inputPerson" className='col-span-1 text-base'>Status</label>
                  <select className="form-select text-dark col-span-4 text-base" value={status} onChange={(e) => setStatus(e.target.value)} required>
                    <option >Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center  justify-center gap-6 pt-8">
                <button type="submit" className="btn btn-success gap-2">
                  <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Submit
                </button>
                <Link to="/pages/inventory/items"><button type="button" className="btn btn-danger gap-2" >
                  <IconTrashLines className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                  Cancel
                </button></Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default editItem;