import React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import IconFile from '../../../../components/Icon/IconFile';
import logo from '/assets/images/Govt/govt.png';
import axios from 'axios';
import { number } from 'yup';


const mushak61: React.FC = () => {
    const navigate = useNavigate();
    const params = useParams();

    // Function to get today's date in the format "YYYY-MM-DD"
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handlePrintButtonClick = () => {
        window.print();
    };

    interface openingDetails {
        itemId: number;
        itemType: number;
        openingQuantity: number;
        openingRate: number;
        openingValue: number;
        openingDate: string;
        closingDate: string;
      }

    interface purchaseDetails {
        id: number;
        itemName: string;
        hsCode: string;
        description: string;
        supplierName: string;
        supplierAddress: string;
        supplierTin: string;
        pinvoiceNo: string;
        vendorInvoice: string;
        qty: number;
        rate: number;
        amount: number;
        sdAmount: number;
        cdAmount: number;
        rdAmount: number;
        vatableValue: number;
        vatRate: number;
        taxAmount: number;
        tAmount: number;
        chalanDate: string;
        entryDate: string;
      }

    interface productionDetails {
        id: number;
        proInvoiceId: number;
        usedQty: number;
        rate: number;
        productionDate: string;
      }
    interface debitNoteDetails {
        id: number;
        debitNoteNo: string;
        purchaseAmount: number;
        vatAmount: number;
        sdAmount: number;
        returnQty: number;
        returnAmount: number;
        returnVat: number;
        returnSd: number;
        dnIssueDate: string;
      }

    const [openingDetails, setOpeningDetails] = useState<openingDetails[]>([]);
    const [purchaseItemDetails, setPurchaseDetails] = useState<purchaseDetails[]>([]);
    const [productionDetails, setProductionDetails] = useState<productionDetails[]>([]);
    const [debitNoteDetail, setDebitNoteDetails] = useState<debitNoteDetails[]>([]);
    
    const [openingDate, setOpeningDate] = useState("");
    const [openingQuantity, setOpeningQty] = useState("");
    const [openingRate, setOpeningRate] = useState("");
    const [openingValue, setOpeningValue] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [companyAddress, setCompanyAddress] = useState("");
    const [companyTin, setCompanyTin] = useState("");
    const [itemDetails, setItemName] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('Token');
        if(token){
        const bearer =  token.slice(1,-1); 
  
        const headers= { Authorization: `Bearer ${bearer}` }
  
        axios.get(`http://localhost:8080/bmitvat/api/mushak61/getItemsDetail/${params.data}`,{headers})
            .then((response) => {
                setCompanyName(response.data.companyReportModels.companyName);
                setCompanyAddress(response.data.companyReportModels.street);
                setCompanyTin(response.data.companyReportModels.comTin);

                setOpeningDetails(response.data.openingAddModel);
                setOpeningDate(response.data.openingAddModel.openingDate);
                setOpeningQty(response.data.openingAddModel.openingQuantity);
                setOpeningRate(response.data.openingAddModel.openingRate);
                setOpeningValue(response.data.openingAddModel.openingValue);

                setPurchaseDetails(response.data.purchaseItem61Models);
                setProductionDetails(response.data.productionItem61Models);
                setDebitNoteDetails(response.data.debitNoteItem61Models);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        }
    }, []);

    const itemName = purchaseItemDetails.reduce((acc, item) => { return item.itemName;  }, '');
    const pInvoiceNo = purchaseItemDetails.reduce((acc, item) => { return item.pinvoiceNo;  }, '');

    let preQty = openingQuantity;
    let prePrice = openingValue;

    let totalUsedQty = openingQuantity;
    let totalPrice = openingValue;

    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     const dataTable = document.querySelector('#dataTable tbody') as HTMLTableElement;
    //     const arrayData: any[] = [];
    //     if (dataTable) {
    //         dataTable.querySelectorAll('tr').forEach((row) => {

    //             const rowData: any = {};

    //             row.querySelectorAll('td input').forEach((input) => {
    //                 const inputElement = input as HTMLInputElement;
    //                 rowData[inputElement.name || 'ক্রমিক সংখ্যা'] = inputElement.value;
    //                 rowData[inputElement.name || 'তারিখ'] = inputElement.value;
    //                 rowData[inputElement.name || 'উৎপাদিত পণ্য /সেবার প্রারম্ভিক জের'] = inputElement.value;
    //                 rowData[inputElement.name || 'উৎপাদন'] = inputElement.value;
    //                 rowData[inputElement.name || 'মোট উৎপাদিত পণ্য /সেবা'] = inputElement.value;
    //                 rowData[inputElement.name || 'ক্রেতা/সরবরাহ গ্রহিতা'] = inputElement.value;
    //                 rowData[inputElement.name || 'চালান পত্রের বিবরন'] = inputElement.value;
    //                 rowData[inputElement.name || 'বিক্রিত /সরবরাহকৃত পণ্যের বিবরন'] = inputElement.value;
    //                 rowData[inputElement.name || 'পণ্যের প্রান্তিক জের'] = inputElement.value;
    //                 rowData[inputElement.name || 'মন্তব্য'] = inputElement.value;
    //             });
    //             arrayData.push(rowData);

    //         });

    //     } else {
    //         console.error("Could not find #dataTable tbody element");
    //     }
    // };

    return (
        <div className='p-1'>
            <div className="items-center justify-between flex-wrap text-black m-6 grid grid-cols-3 gap-4">
                <div>
                    <img className="h-20 w-20" src={logo} />
                </div>
                <div className="font-bold text-center grid grid-rows-2 grid-flow-col gap-4 pt-8">
                    <h3 className='text-xl'>গনপ্রজাতন্ত্রী বাংলাদেশ সরকার</h3>
                    <h3>জাতীয় রাজস্ব বোর্ড</h3>
                </div>
                <div>
                    <button onClick={handlePrintButtonClick} className="btn btn-success gap-2 float-right" >
                        <IconFile className="w-5 h-5 ltr:mr-1 rtl:ml-1" />
                        Print
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-right mr-7 ">
                <div></div>
                <div>
                    <button type="submit" className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400" >
                        মূসক- ৬.১
                    </button>
                </div>
            </div>
            <div className="pt-5 gap-2 m-5">
                <div className="mb-5">
                    <div className="" id="browser_default">
                        <div className="flex flex-col items-center justify-between mb-7">
                            <div className='flex sm:flex-row flex-row pt-4'>
                                <label className="mr-3 text-base font-normal"> প্রতিষ্ঠানের নাম: </label>
                                <p className="text-base font-medium"> {companyName} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> ঠিকানা: </label>
                                <p className="text-base font-medium"> {companyAddress} </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> করদাতার সনাক্তকরণ সংখ্যা: </label>
                                <p className="text-base font-medium"> {companyTin} </p>
                            </div>
                            <div className="font-bold text-center grid grid-rows-2 grid-flow-col pt-2">
                                <h3>ক্রয় হিসাব পুস্তক</h3>
                            </div>
                            <h5 className="text-base dark:text-white-light">(পণ্য বা সেবা প্রক্রিয়াকরনে সম্পৃক্ত এমন নিবন্ধিত বা তালিকাভুক্ত ব্যক্তির জন্য প্রযোজ্য)</h5>
                            <h5 className="text-base dark:text-white-light">[ বিধি ৪০(১) এর দফা (ক) এবং ৪১ এর দফা (ক) দ্রষ্টব্য ]</h5>
                        </div>

                        <div className="mb-5">
                            <div className="border-collapse border overflow-hidden overflow-x-auto">
                                <table className="table-fixed w-full">
                                    <thead className="border-b">
                                        <tr className="text-black font-bold h-8">
                                            <th colSpan={21} className="text-left p-4 border border-black">
                                                পণ্য: {itemName}
                                            </th>
                                        </tr>
                                        <tr className="font-bold h-8 border-black text-black">
                                                <th colSpan={21} style={{ textAlign: 'center' }} className="border border-black">পণ্য/সেবার উপকরণ ক্রয়</th>
                                        </tr>
                                        <tr className="text-black border border-black font-bold h-8">
                                            <th rowSpan={3} className="md:p-4 p-0 md:w-10 w-10 border border-black align-text-top"> ক্রমিক সংখ্যা</th>
                                            <th rowSpan={3} className="md:p-4 p-0 md:w-10 w-10 border border-black align-text-top">তারিখ </th>
                                            <th colSpan={2} className="text-center border border-black align-text-top">মজুদ উপকরণের প্রারম্ভিক জের</th>
                                            <th colSpan={14} style={{ textAlign: 'center' }} className=" border border-black align-text-top"> ক্রয়কৃত উপকরণ</th>
                                            <th colSpan={2} className="text-center border border-black align-text-top"> উপকরণের প্রান্তিক জের</th>
                                            <th rowSpan={3} className="text-center border border-black align-text-top"> মন্তব্য </th>
                                        </tr>
                                        <tr className="border-b border-black h-8 text-black" >
                                            <th rowSpan={2} className="text-center align-text-top border border-black">পরিমাণ (একক)</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">চালান পত্র/বিল অব এন্ট্রি নম্বর</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">তারিখ</th>
                                            <th colSpan={3} className="text-center align-text-top border border-black">বিক্রেতা/সরবরাহকারী</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">বিবরণ</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">পরিমাণ</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">সম্পূরক (শুল্ক যদি থাকে)</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">মূসক</th>
                                            <th colSpan={2} className="text-center align-text-top border border-black">মোট উপকরণের পরিমাণ </th>
                                            <th colSpan={2} className="text-center align-text-top border border-black">পণ্য প্রস্তুত/প্রক্রিয়াকরণে উপকরণের ব্যাবহার</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">পরিমাণ (একক)</th>
                                            <th rowSpan={2} className="text-center align-text-top border border-black">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                        </tr>
                                        <tr className="border border-black h-8 text-black">
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>নাম</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>ঠিকানা</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>নিবন্ধন/তালিকাভুক্তি/জাতীয় পরিচয় পত্র নং</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>পরিমাণ<br />(একক)</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>পরিমান<br />(একক)</th>
                                            <th style={{ textAlign:'center' }} className='align-text-top border border-black'>মূল্য(সকল প্রকার কর ব্যতীত)</th>
                                        </tr>
                                        <tr>
                                            <th className="text-center border border-black">(১)</th>
                                            <th className="text-center border border-black">(২)</th>
                                            <th className="text-center border border-black">(৩)</th>
                                            <th className="text-center border border-black">(৪)</th>
                                            <th className="text-center border border-black">(৫)</th>
                                            <th className="text-center border border-black">(৬)</th>
                                            <th className="text-center border border-black">(৭)</th>
                                            <th className="text-center border border-black">(৮)</th>
                                            <th className="text-center border border-black">(৯)</th>
                                            <th className="text-center border border-black">(১০)</th>
                                            <th className="text-center border border-black">(১১)</th>
                                            <th className="text-center border border-black">(১২)</th>
                                            <th className="text-center border border-black">(১৩)</th>
                                            <th className="text-center border border-black">(১৪)</th>
                                            <th className="text-center border border-black">(১৫)=(৩+১১)</th>
                                            <th className="text-center border border-black">(১৬)=(৪+১২)</th>
                                            <th className="text-center border border-black">(১৭)</th>
                                            <th className="text-center border border-black">(১৮)</th>
                                            <th className="text-center border border-black">(১৯)</th>
                                            <th className="text-center border border-black">(২০)</th>
                                            <th className="text-center border border-black">(২১)</th>
                                        </tr>
                                        
                                    </thead>
                                    <tbody>
                                    {/* {openingDetails.map((item, index) => {
                                         totalUsedQty += item.openingQuantity;
                                         totalPrice += item.openingValue;
                                        return ( */}
                                            <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black overflow-hidden">{openingDate}</td>
                                                <td className="p-0 border border-black">{preQty}</td>
                                                <td className="p-0 border border-black">{prePrice}</td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black">{openingQuantity}</td>
                                                <td className="p-0 border border-black">{openingValue}</td>
                                                <td className="p-0 border border-black"></td>
                                            </tr>
                                        {/* );
                                    })}  */}

                                    {purchaseItemDetails.map((item, index) => {
                                         preQty = totalUsedQty;
                                         prePrice = totalPrice;
                                         totalUsedQty += item.qty;
                                         totalPrice += item.qty*item.rate;
                                         return (
                                            <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black overflow-hidden" >{item.chalanDate}</td>
                                                <td className="p-0 border border-black">{preQty}</td>
                                                <td className="p-0 border border-black">{prePrice}</td>
                                                <td className="p-0 border border-black overflow-hidden">{item.pinvoiceNo}</td>
                                                <td className="p-0 border border-black"></td>
                                                <td className="p-0 border border-black">{item.supplierName}</td>
                                                <td className="p-0 border border-black">{item.supplierAddress}</td>
                                                <td className="p-0 border border-black">{item.supplierTin}</td>
                                                <td className="p-0 border border-black">{item.itemName}</td>
                                                <td className="p-0 border border-black">{item.qty}</td>
                                                <td className="p-0 border border-black">{item.qty*item.rate}</td>
                                                <td className="p-0 border border-black">{item.sdAmount}</td>
                                                <td className="p-0 border border-black">{item.taxAmount}</td>
                                                <td className="p-0 border border-black">{totalUsedQty}</td>
                                                <td className="p-0 border border-black">{totalPrice}</td>
                                                <td className="p-0 border border-black">{totalUsedQty}</td>
                                                <td className="p-0 border border-black">{totalPrice}</td>
                                                <td className="p-0 border border-black">{totalUsedQty}</td>
                                                <td className="p-0 border border-black">{totalPrice}</td>
                                                <td className="p-0 border border-black"></td>
                                            </tr>
                                         );
                                    })}

                                    {debitNoteDetail.map((item, index) => {
                                         preQty = totalUsedQty;
                                         prePrice = totalPrice;
                                         totalUsedQty += item.returnQty;
                                         totalPrice += item.returnAmount;

                                         return (
                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black overflow-hidden" >{item.dnIssueDate}</td>
                                            <td className="p-0 border border-black">{preQty}</td>
                                            <td className="p-0 border border-black">{prePrice}</td>
                                            <td className="p-0 border border-black overflow-hidden">{item.debitNoteNo}</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{item.returnQty}</td>
                                            <td className="p-0 border border-black">{item.returnAmount}</td>
                                            <td className="p-0 border border-black">{item.sdAmount}</td>
                                            <td className="p-0 border border-black">{item.vatAmount}</td>
                                            <td className="p-0 border border-black">{totalUsedQty}</td>
                                            <td className="p-0 border border-black">{totalPrice}</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{totalUsedQty}</td>
                                            <td className="p-0 border border-black">{totalPrice}</td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>
                                         );
                                    })}

                                    {productionDetails.map((item, index) => {
                                        preQty = totalUsedQty;
                                        prePrice = totalPrice;
                                        totalUsedQty +=  -item.usedQty;
                                        totalPrice += -(item.rate * item.usedQty);
                                        return(
                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black overflow-hidden">{item.productionDate}</td>
                                            <td className="p-0 border border-black">{preQty}</td>
                                            <td className="p-0 border border-black">{prePrice}</td>
                                            <td className="p-0 border border-black overflow-hidden">{item.proInvoiceId}</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{item.usedQty}</td>
                                            <td className="p-0 border border-black">{item.rate * item.usedQty}</td>
                                            <td className="p-0 border border-black">{totalUsedQty}</td>
                                            <td className="p-0 border border-black">{totalPrice}</td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>
                                        )
                                        })}

                                        <tr className="hover:bg-gray-50 text-center border border-black h-10">
                                            <td className="p-0 border border-black">Total</td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black"></td>
                                            <td className="p-0 border border-black">{totalUsedQty}</td>
                                            <td className="p-0 border border-black">{totalPrice}</td>
                                            <td className="p-0 border border-black"></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div className="pb-1">
                                <p className='pt-3 font-semibold text-xl'>বিশেষ দ্রষ্টব্য:</p>
                                <p className='pt-3 font-semibold'>*উৎসে কর্তনযোগ্য সরবরাহের ক্ষেত্রে ফর্মটি সমন্নিত কর চালানপত্র ও উৎসে কর সনদপত্র হিসাবে বিবেচিত হইবে এবং উৎসে কর্তনযোগ্য সরবরাহের ক্ষেত্রে প্রযোজ্য হইবে</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default mushak61;


