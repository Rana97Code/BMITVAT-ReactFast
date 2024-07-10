import React from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import logo from '/assets/images/Govt/govt.png';
import IconFile from '../../../../components/Icon/IconFile';

// import * as $ from 'jquery';
import { number } from 'yup';

import Table1 from './components/Table1';
import Table2 from './components/Table2';
import Table3 from './components/Table3';
import Table4 from './components/Table4';
import Table5 from './components/Table5';
import Table6 from './components/Table6';
import Table7 from './components/Table7';
import Table8 from './components/Table8';
import Table9 from './components/Table9';
import Table10 from './components/Table10';
import Table11 from './components/Table11';
import Table12 from './components/Table12';


const mushak91: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();

    return (
        <div>
            <div className="items-center justify-between flex-wrap text-black grid grid-cols-3">
                <div>
                    <img className="h-20 w-30 pl-6 mt-2" src={logo} />
                </div>
                <div className="font-bold text-center grid grid-rows-3 gap-2 pt-2">
                    <h3 className='text-sm'>GOVERNMENT OF THE PEOPLE,S REPUBLIC BANGLADESH</h3>
                    <h3>NATIONAL BOARD OF REVENUE</h3>
                    <h3>DHAKA</h3>
                </div>
                <div>
                    <button type="submit" className="btn btn-success gap-2 float-right mr-4" >
                        Mushak-9.1
                    </button>
                </div>
            </div>

            <div className="m-2">
                <div className="font-bold text-center grid gap-2 text-sm mb-5">
                    <h3>VALUE ADDED TAX RETURN FORM</h3>
                    <h3>[See rule 47(1)]</h3>
                    <h3>[Please read the instructions before filling up this form]</h3>
                </div>
                <div className="mb-2">
                    <div className="border-collapse overflow-hidden overflow-x-auto">

                        {/*-------------- Table -------------*/}
                        <Table1 />
                        <Table2 />
                        <Table3 />
                        <Table4 />
                        <Table5 />
                        <Table6 />
                        <Table7 />
                        <Table8 />
                        <Table9 />
                        <Table10 />
                        <Table11 />
                        <Table12 />
                    </div>
                </div>
                <div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-5 m-2">
                <input id="browserLname" type="date" className="form-input" />
                <button type="submit" className="btn btn-success gap-2" >
                    <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                    Submit Closing
                </button>
            </div>

        </div>

    );
};

export default mushak91;


