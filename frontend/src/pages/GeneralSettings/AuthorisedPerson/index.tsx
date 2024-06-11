import React from 'react';
import { Link, NavLink, useNavigate }  from 'react-router-dom';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState, Fragment } from 'react';
import sortBy from 'lodash/sortBy';
import { useDispatch } from 'react-redux';
import { setPageTitle } from '../../../store/themeConfigSlice';
import IconPlus from '../../../components/Icon/IconPlus';

import IconEdit from '../../../components/Icon/IconEdit';
import axios from 'axios';




const index = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('Token');

        if(token){
            const bearer =  token.slice(1,-1); 
            // const bearer1 = JSON.parse(token);

        const headers= { Authorization: `Bearer ${bearer}` }

        axios.get('http://localhost:8080/bmitvat/api/authorised_person/all_person',{headers})
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

    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'id', direction: 'asc' });

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
            return initialRecords.filter((person: any) => {
                return (
                    person.id.toString().includes(search.toLowerCase()) ||
                    person.personName.toLowerCase().includes(search.toLowerCase()) ||
                    person.description.toString().toLowerCase().includes(search.toLowerCase()) ||
                    person.phoneNumber.toLowerCase().includes(search.toLowerCase()) ||
                    person.signature.toLowerCase().includes(search.toLowerCase()) ||
                    person.action.toLowerCase().includes(search.toLowerCase())
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
                <h2 className="text-xl font-bold">Authorised Person</h2>
                <div className="flex items-center flex-wrap gap-3">
                    <Link to="/pages/settings/authorised_person/add" className="btn btn-primary gap-1">
                        <IconPlus />
                        Add New
                    </Link>
                </div>
            </div>

 

            <div className="panel mt-6">
                
                <div className="datatables">
                <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'id', title: 'Id', sortable: true },
                            { accessor: 'personName', title: 'Authorised Person Name', sortable: true },
                            { accessor: 'description', title: 'Person Description', sortable: true },
                            { accessor: 'phoneNumber', title: 'Person Phone Number', sortable: true },
                            { accessor: 'image', title: 'Person Signature', sortable: false,
                             render: ({ signature })=>( <img src={'/assets/images/authorised_person/'+ signature} className="h-16 w-40" />) },
                            {
                                accessor: 'action',
                                title: 'Action',
                                sortable: false,
                                textAlignment: 'center',
                                render: ({ id }) => (
                                    <div className="flex gap-4 items-center w-max mx-auto">
                                        <NavLink to={"/pages/settings/authorised_person/edit/" + id} className="flex btn btn-outline-primary btn-sm m-1 p-2">
                                            <IconEdit className="w-4.5 h-4.5 mr-2" />
                                            Edit
                                        </NavLink>
                                    </div>
                                ),
                            },
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
    );
};

export default index;
