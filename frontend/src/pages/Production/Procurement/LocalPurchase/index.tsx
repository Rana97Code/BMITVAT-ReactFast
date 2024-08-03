
import React, { useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, Fragment, useEffect } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../../store/themeConfigSlice';
import IconPlus from '../../../../components/Icon/IconPlus';
import axios from 'axios';
import UserContex from '../../../../context/UserContex';


const index = () => {

    const navigate = useNavigate();
    // const params = useParams();
    const [showAlert, setShowAlert] = useState(false);
    const user = useContext(UserContex);
        const headers= user.headers;
        const baseUrl= user.base_url;

    useEffect(()=> {
        if(user){
            axios.get(`${user.base_url}/local_purchase/all-purchase`,{headers})
            .then((response) => {
                setInitialRecords(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);

            });

        }
    },[user]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setPageTitle('Export Table'));
    });


    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState([]);
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'serial', direction: 'asc' });

    interface RecordWithIndex {
        [key: string]: any; // Define the type for each property in the record
        index: number; // Add index property
        // customer_name: string;
        // customer_email: string;
        // customer_phone: string;
        // c_address: string;
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
                    item.serial.toString().includes(search.toLowerCase()) ||
                    item.invoice_no.toLowerCase().includes(search.toLowerCase()) ||
                    item.supplier_name.toLowerCase().includes(search.toLowerCase())
                     
                );
            });
        });
    }, [search]);

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    // File Upload
    const [addFileModal, setAddFileModal] = useState<any>(false);

    const [defaultParams] = useState({
        file: '',
    });

    const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(defaultParams)));

    const editUser = (user: any = null) => {
        const json = JSON.parse(JSON.stringify(defaultParams));
        setParams(json);
        if (user) {
            let json1 = JSON.parse(JSON.stringify(user));
            setParams(json1);
        }
        setAddFileModal(true);
    };

    const [codeArr, setCodeArr] = useState<string[]>([]);

    const toggleCode = (name: string) => {
        if (codeArr.includes(name)) {
            setCodeArr((value) => value.filter((d) => d !== name));
        } else {
            setCodeArr([...codeArr, name]);
        }
    };

    const [images, setImages] = useState<any>([]);
    const [images2, setImages2] = useState<any>([]);
    const maxNumber = 69;




    return (
        <div>
             <div className="panel flex items-center justify-between flex-wrap gap-4 text-black">
                 <h2 className="text-xl font-bold">Production Local Purchase</h2>
                 <div className="flex items-center flex-wrap gap-3">
                     <Link to="/pages/procurment/local_purchase/add" className="btn btn-primary gap-1">
                         <IconPlus />
                         Add New
                     </Link>
                </div>
             </div>

<div className="pt-5">
                 {/*----------------- User list start ---------------*/}
                 <div className="panel col-span-3 " id="stack_form">
                     <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                         <div className="flex items-center justify-between mb-6">
                             <h5 className="font-semibold text-lg dark:text-white-light">Local Purchase List</h5>
                         </div>
                         <input type="search" className="form-input w-auto" placeholder="Search..." />
                     </div>
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsDataWithIndex}
                        columns={[
                                { accessor: 'id', title: 'Serial', sortable: true },
                                { accessor: 'invoice_no', title: 'Invoice No', sortable: true },
                                { accessor: 'supplier_name', title: 'Supplier', sortable: true },
                                
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
        </div>
        </div>
    );
};

export default index;