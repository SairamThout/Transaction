import React, { useState } from 'react';
import './App.css';
import Header from './Header';
import Detail from './Detail';
import Transaction from './transaction';
import Add_Modal from './Add_Modal';
import Upload_Model from './Upload_Modal';
const App = () => {

  const [addbuttonclicked, setaddbuttonclicked] = useState(false);
  const [uploadbuttonclicked, setuploadbuttonclicked] = useState(false);

  return (
      <div className='container'>
        <Header setaddclick={setaddbuttonclicked} setuploadclick={setuploadbuttonclicked} />
        <Detail />
        <Transaction/>
      <Add_Modal clicked={addbuttonclicked} setclick={setaddbuttonclicked} />
      <Upload_Model clicked={uploadbuttonclicked} setclick={setuploadbuttonclicked}/>
      </div>
    );
}

export default App;
