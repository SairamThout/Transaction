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
let result = (await axios.get("/getdata")).data;

function App() {

  const [addbuttonclicked, setaddbuttonclicked] = useState(false);
  const [uploadbuttonclicked, setuploadbuttonclicked] = useState(false);
  const [editbutton, seteditbutton] = useState({clicked:false,id:""});
  const [trans, settrans] = useState([...result]);
  const [page, setpage] = useState(1);
  const [row_per_page, set_row_per_page] = useState(10);



  return (
      <div className='container'>
        <Header setaddclick={setaddbuttonclicked} setuploadclick={setuploadbuttonclicked}  />
        <Detail />
        <Transaction trans={trans} settrans={settrans} setedit={seteditbutton} page={page} row={row_per_page} />
      <Pagination page={ page} setpage={setpage} row={row_per_page} setrow={set_row_per_page} trans={trans} />
        <Add_Modal clicked={addbuttonclicked} setclick={setaddbuttonclicked} trans={trans} settrans={settrans} />
        <Edit_Modal editbutton={editbutton} setclick={seteditbutton} settrans={settrans} />
        <Upload_Model clicked={uploadbuttonclicked} setclick={setuploadbuttonclicked} trans={trans} settrans={settrans}/>
      </div>
    );
}

export default App;
