import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Detail from './Detail';
import Transaction from './transaction';
import Add_Modal from './Add_Modal';
import Upload_Model from './Upload_Modal';
import axios from 'axios';
import Edit_Modal from './Edit_Modal';
import Pagination from './Pagination';
import Loader from './Loader';
import Successful from './Successful_Model';
import Unsuccessful from './Unsuccessful_Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let result = (await axios.get("/transaction")).data.data;

function App() {

  const [addbuttonclicked, setaddbuttonclicked] = useState(false);
  const [uploadbuttonclicked, setuploadbuttonclicked] = useState(false);
  const [editbutton, seteditbutton] = useState({clicked:false,id:""});
  const [trans, settrans] = useState(result);
  const [page, setpage] = useState(1);
  const [row_per_page, set_row_per_page] = useState(10);
  const [csvdatauploaded, setcsvdatauploaded] = useState(true);
  const [successfulclicked, setsuccessfulclick] = useState(false);
  const [unsuccessfulclicked, setunsuccessfulclick] = useState(false);
  
  return (
      <div className='container'>
        <Header setaddclick={setaddbuttonclicked} setuploadclick={setuploadbuttonclicked}  />
        <Detail />
        <Transaction trans={trans} settrans={settrans} setedit={seteditbutton} page={page} row={row_per_page} />
      <Pagination page={ page} setpage={setpage} row={row_per_page} setrow={set_row_per_page} trans={trans} />
        <Add_Modal  clicked={addbuttonclicked} setclick={setaddbuttonclicked} settrans={settrans}  />
        <Edit_Modal  editbutton={editbutton} seteditbutton={seteditbutton} settrans={settrans} />
        <Upload_Model   setsuccessfulclick={setsuccessfulclick} setunsuccessfulclick={setunsuccessfulclick} setcsvdatauploaded={setcsvdatauploaded} clicked={uploadbuttonclicked} setclick={setuploadbuttonclicked}  settrans={settrans}/>
      <Loader  clicked={csvdatauploaded} setclick={setcsvdatauploaded}></Loader>
      <Successful clicked={successfulclicked} setclick={setsuccessfulclick}></Successful>
      <Unsuccessful clicked={unsuccessfulclicked} setclick={setunsuccessfulclick}></Unsuccessful>
      <ToastContainer position='top-right' limit={5}/>
    </div>
    );
}

export default App;
