import React from 'react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate,useParams } from 'react-router-dom';
import IconFile from '../../../../components/Icon/IconFile';
import logo from '/assets/images/Govt/govt.png';
import axios from 'axios';
import { number } from 'yup';


const mushak62: React.FC = () => {
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
                    <button type="submit" className="btn btn-success gap-2 float-right" >
                        <IconFile className="w-5 h-5 ltr:mr-1 rtl:ml-1" />
                        Print
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-right mr-7 ">
                <div></div>
                <div>
                    <button type="submit" className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400" >
                        মূসক- ৬.২
                    </button>
                </div>
            </div>
            <div className="pt-5 gap-2 m-5">
                <div className="mb-5">
                    <div className="" id="browser_default">
                        <div className="flex flex-col items-center justify-between mb-7">
                            <div className='flex sm:flex-row flex-row pt-4'>
                                <label className="mr-3 text-base font-normal"> প্রতিষ্ঠানের নাম: </label>
                                <p className="text-base font-medium"> SQ Wire & Cable Co. Ltd. </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> ঠিকানা: </label>
                                <p className="text-base font-medium"> Kewdhala, Madanpur, Bandar, Narayangonj </p>
                            </div>
                            <div className='flex sm:flex-row flex-row'>
                                <label className="mr-3 text-base font-normal"> করদাতার সনাক্তকরণ সংখ্যা: </label>
                                <p className="text-base font-medium"> 000342146-0304 </p>
                            </div>
                            <div className="font-bold text-center grid grid-rows-2 grid-flow-col pt-2">
                                <h3>জাতীয় রাজস্ব বোর্ড</h3>
                            </div>
                            <h5 className="text-base dark:text-white-light">(পণ্য বা সেবা প্রক্রিয়াকরনে সম্পৃক্ত এমন নিবন্ধিত বা তালিকাভুক্ত ব্যক্তির জন্য প্রযোজ্য)</h5>
                            <h5 className="text-base dark:text-white-light">[বিধি ৪০ উপ-বিধি এর (১) এর দফা (গ) ও দফা (চ) দ্রষ্টব্য]</h5>
                        </div>

                        <div className="mb-5">
                            <div className="border-collapse border overflow-hidden overflow-x-auto">
                                <table className="table-fixed w-full">
                                    <thead className="border-b">
                                        <tr className="text-black font-bold h-10">
                                            <th colSpan={21} className="text-left p-4 border-b">
                                                পণ্য:1x1.0 RM (BYA Skin Coated FR)
                                            </th>
                                        </tr>
                                        <tr className="font-bold h-10 text-black">
                                            <th colSpan={21} className="text-center border-b">পণ্য/সেবার বিক্রয়</th>
                                        </tr>
                                        <tr className="text-black font-bold h-10">
                                            <th className="md:p-4 p-0 md:w-10 w-10 border-r">
                                                ক্রমিক সংখ্যা
                                            </th>
                                            <th className="md:p-4 p-0 md:w-10 w-10">
                                                তারিখ
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                উৎপাদিত পণ্য /সেবার প্রারম্ভিক জের
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                উৎপাদন
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                মোট উৎপাদিত পণ্য /সেবা
                                            </th>
                                            <th
                                                colSpan={3}
                                                className="text-center p-4 border border-t-0 "
                                            >
                                                ক্রেতা/সরবরাহ গ্রহিতা
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                চালান পত্রের বিবরন
                                            </th>
                                            <th
                                                colSpan={5}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                বিক্রিত /সরবরাহকৃত পণ্যের বিবরন
                                            </th>
                                            <th
                                                colSpan={2}
                                                className="text-center p-4 border border-t-0"
                                            >
                                                পণ্যের প্রান্তিক জের
                                            </th>
                                            <th className="text-center md:p-4 p-0 md:w-20 w-10 border-b">
                                                মন্তব্য
                                            </th>
                                        </tr>
                                        <tr className="border-b border-gray-400 font-bold h-10 text-black">
                                            <th className="text-center p-4 border"></th>
                                            <th className="text-center p-4 border"></th>
                                            <th className="text-center p-4 border">পরিমাণ (একক)</th>
                                            <th className="text-center p-4 border">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                            <th className="text-center p-4 border">পরিমাণ (একক)</th>
                                            <th className="text-center p-4 border">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                            <th className="text-center p-4 border">পরিমাণ (একক)</th>
                                            <th className="text-center p-4 border">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                            <th className="text-center p-4 border">নাম</th>
                                            <th className="text-center p-4 border">ঠিকানা</th>
                                            <th className="text-center p-4 border">নিবন্ধন/ তালিকা ভুক্ত/ জাতীয় পরিচয় পত্র নং</th>
                                            <th className="text-center p-4 border">নম্বর</th>
                                            <th className="text-center p-4 border">তারিখ</th>
                                            <th className="text-center p-4 border">বিবরণ</th>
                                            <th className="text-center p-4 border">পরিমাণ</th>
                                            <th className="text-center p-4 border">কর যোগ্য মূল্য</th>
                                            <th className="text-center p-4 border">সম্পূরক (শুল্ক যদি থাকে)</th>
                                            <th className="text-center p-4 border">মূসক</th>
                                            <th className="text-center p-4 border">পরিমাণ (একক)</th>
                                            <th className="text-center p-4 border">মূল্য( সকল প্রকার কর ব্যতীত)</th>
                                            <th className="text-center p-4 border"></th>
                                        </tr>
                                        <tr>
                                        <th className="text-center p-4 border">(১)</th>
                                            <th className="text-center p-4 border">(২)</th>
                                            <th className="text-center p-4 border">(৩)</th>
                                            <th className="text-center p-4 border">(৪)</th>
                                            <th className="text-center p-4 border">(৫)</th>
                                            <th className="text-center p-4 border">(৬)</th>
                                            <th className="text-center p-4 border">(৭)=(৩+৫)</th>
                                            <th className="text-center p-4 border">(৮)=(৪+৬)</th>
                                            <th className="text-center p-4 border">(৯)</th>
                                            <th className="text-center p-4 border">(১০)</th>
                                            <th className="text-center p-4 border">(১১)</th>
                                            <th className="text-center p-4 border">(১২)</th>
                                            <th className="text-center p-4 border">(১৩)</th>
                                            <th className="text-center p-4 border">(১৪)</th>
                                            <th className="text-center p-4 border">(১৫)</th>
                                            <th className="text-center p-4 border">(১৬)</th>
                                            <th className="text-center p-4 border">(১৭)</th>
                                            <th className="text-center p-4 border">(১৮)</th>
                                            <th className="text-center p-4 border">(১৯)=(৭-১৫)</th>
                                            <th className="text-center p-4 border">(২০)=(৮-১৬)</th>
                                            <th className="text-center p-4 border">(২১)</th>
                                        </tr>
                                        
                                    </thead>
                                    <tbody>
                                        <tr className="hover:bg-gray-50 text-center border-b-0 border-b-none h-10">
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r">{openingDate}</td>
                                            <td className="p-0 border-l border-r">{preQty}</td>
                                            <td className="p-0 border-l border-r">{prePrice}</td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r"></td>
                                            <td className="p-0 border-l border-r">{openingQuantity}</td>
                                            <td className="p-0 border-l border-r">{openingValue}</td>
                                            <td className="p-0 border-l border-r"></td>
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

export default mushak62;


