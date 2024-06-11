import React from 'react';
import { Link, NavLink,useNavigate } from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconFile from '../../../components/Icon/IconFile';
import IconEdit from '../../../components/Icon/IconEdit';
import axios from 'axios';



const rawmaterials = () => {


  interface Hscode {
    id: number;
    itemName: string;
    calculateYear: string;
    hsCode: string;

  }

  const [OpeningStock, setOpeningStock] = useState<Hscode[]>([]);


  const navigate = useNavigate();


    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
    // State to manage the date value
    const [dateValue, setDateValue] = useState(getTodayDate());

    const [itemId, setItemId] = useState("");
    const [qty, setQty] = useState(0);
    const [rate, setRate] = useState(0);
    const [value, setValue] = useState(0);
    

      useEffect(() => {
        setValue(qty * rate);
      }, [qty, rate]);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    
 
    const newDate = new Date(dateValue);
    const openingDate= newDate.setDate(1);

    // newDate.setMonth(newDate.getMonth() - 1);
    const closingDate =newDate.setDate(newDate.getDate() - 1);


    const itemType = 2;


    const items = {
      itemId: itemId,
      itemType: itemType,
      openingQuantity: qty,
      openingRate: rate,
      openingValue: value,
      openingDate: openingDate,
      closingDate: closingDate
    }

    // console.log(items);

    const token = localStorage.getItem('Token');
    if(token){
      const bearer1 = JSON.parse(token);
    const headers= { Authorization: `Bearer ${bearer1}` }

    try {
       await axios.post("http://localhost:8080/bmitvat/api/opening_stock/add-opening-stock", items, {headers})
        .then(function (response) {
          if(response){
            navigate("/pages/inventory/opening/finishgoods");
          }
        })

    } catch (err) {
      console.log(err);
    }
  }
  };



  useEffect(() => {
      const token = localStorage.getItem('Token');

      if(token){
          const bearer =  token.slice(1,-1); 

      const headers= { Authorization: `Bearer ${bearer}` }

      axios.get('http://localhost:8080/bmitvat/api/item/all_finish_goods',{headers})
          .then((response) => {
              setOpeningStock(response.data);

          })
          .catch((error) => {
              console.error('Error fetching data:', error);

          });
          axios.get('http://localhost:8080/bmitvat/api/opening_stock/all_finish_stock',{headers})
          .then((response) => {
              setInitialRecords(response.data);

          })
          .catch((error) => {
              console.error('Error fetching data:', error);

          });

      }
  }, []);

  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(setPageTitle('Export Table'));
  });
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState([]);
  const [recordsData, setRecordsData] = useState(initialRecords);
  // console.warn(initialRecords);

  const [search, setSearch] = useState('');
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

  interface RecordWithIndex {
    [key: string]: any; // Define the type for each property in the record
    index: number; // Add index property
    itemName: string;
    hsCode: string;
    openingQuantity: string;
    openingRate: string;
    openingValue: string;
    openingDate: string;
}

//For Index Number
const recordsDataWithIndex: RecordWithIndex[] = recordsData.map((record: RecordWithIndex, index: number) => ({
    ...record,
    index: index + 1 
})); 

  useEffect(() => {
      setPage(1);
  }, [pageSize]);

  useEffect(() => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize;
      setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
      setInitialRecords(() => {
          return initialRecords.filter((item: any) => {
              return (
                item.id.toString().includes(search.toLowerCase()) ||
                item.itemName.toLowerCase().includes(search.toLowerCase()) ||
                item.hsCode.toLowerCase().includes(search.toLowerCase()) ||
                item.openingQuantity.toLowerCase().includes(search.toLowerCase()) ||
                item.openingRate.toLowerCase().includes(search.toLowerCase()) ||
                item.openingValue.toLowerCase().includes(search.toLowerCase()) ||
                item.openingDate.toLowerCase().includes(search.toLowerCase())
              );
          });
      });
  }, [search]);

  useEffect(() => {
      const data = sortBy(initialRecords, sortStatus.columnAccessor);
      setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
      setPage(1);
  }, [sortStatus]);
 




  return (
      <div>
          <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
              <h2 className="text-xl font-bold">Define Finish Goods Stock</h2>
          </div>

                <form className="space-y-5 mt-6" onSubmit={handleSubmit} >
                    <div className="flex flex-row gap-4 text-black">

                        <div className="w-2/5 col-span-2 gap--x-2 gap-y-3" >
                            <label htmlFor="unitName" className='col-span-1 text-base'>Finish Goods</label>
                            <select className="form-select text-dark col-span-2 text-base" onChange={(e) => setItemId(e.target.value)} required>
                                <option >Select Finish Goods</option>
                                {OpeningStock.map((option, index) => ( 
                                     <option key={index} value={option.id}> 
                                         {option.itemName+ ' (' +option.hsCode +')'} 
                                   </option> 
                                ))} 
                            </select>
                        </div>
                        <div className="w-2/6 gap--x-2 gap-y-3">
                            <label htmlFor="unitName" className='col-span-1 text-base'>Opening Quantity</label>
                            <input id="openingQty" type="number" className="form-input py-2.5 text-base col-span-2" value={qty} onChange={(e) => setQty(parseFloat(e.target.value))} required />
                        </div>
                        <div className="w-2/6 gap--x-2 gap-y-3">
                            <label htmlFor="unitName" className='col-span-1 text-base'>Opening Rate</label>
                            <input id="openingRate" type="number" className="form-input py-2.5 text-base col-span-2" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} required />
                        </div>
                        <div className="w-2/6 gap--x-2 gap-y-3">
                            <label htmlFor="unitName" className='col-span-1 text-base'>Opening Value</label>
                            <input id="openingValue" type="text" className="form-input py-2.5 text-base col-span-2" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} disabled />
                        </div>
                        <div className="w-1/6 gap--x-2 gap-y-3">
                            <label htmlFor="unitName" className='col-span-1 text-base'>Opening Date</label>
                            <input id="unitName" type="date" className="form-input py-2.5 text-base col-span-2" value={dateValue} onChange={(e) => setDateValue(e.target.value)} required />
                        </div>
                        <div className="flex items-center  justify-center gap-6 pt-6">
                            <button type="submit" className="btn btn-success gap-2">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            Submit
                            </button>
                    
                        </div>
                    </div>
                </form>


              {/*-------------- Datatable start ------------------*/}
              <div className="datatables mt-6">
                <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                    <h2 className="text-xl font-bold">Raw Finish Goods Stock</h2>
                </div>

                  <DataTable
                      highlightOnHover
                      className="whitespace-nowrap table-hover"
                      records={recordsDataWithIndex}
                      columns={[
                        { accessor: 'index', title: 'Serial', sortable: true },
                        { accessor: 'itemName', title: 'Item Name', sortable: true, width: '300px', cellsStyle:{ overflow: 'hidden'} },
                        { accessor: 'hsCode', title: 'HS-Code', sortable: true, width: '300px', cellsStyle:{ overflow: 'hidden'} },
                        { accessor: 'openingQuantity', title: 'Opening-Quantity', sortable: true },
                        { accessor: 'openingRate', title: 'Opening Rate', sortable: true },
                        { accessor: 'openingValue', title: 'Opening Value', sortable: true },
                        { accessor: 'openingDate', title: 'Opening Date', sortable: true },

                    ]}
                      totalRecords={initialRecords.length}
                      recordsPerPage={pageSize}
                      page={page}
                      onPageChange={(p) => setPage(p)}
                      recordsPerPageOptions={PAGE_SIZES}
                      onRecordsPerPageChange={setPageSize}
                      sortStatus={sortStatus}
                      onSortStatusChange={setSortStatus}
                      minHeight={200}
                      paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                  />
              </div>
          </div>

  );
};

export default rawmaterials;
