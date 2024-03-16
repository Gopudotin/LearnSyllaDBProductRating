import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataList = ({ onSelect }) => {
  const [datas, setDatas] = useState([]);

  useEffect(() => {
    fetchDatas();
  }, []);

  const fetchDatas = async () => {
    try {
      const response = await axios.get('/datas');
      setDatas(response.data);
    } catch (error) {
      console.error('Error fetching datas:', error);
    }
  };

  return (
    <div>
      <h2>Data List</h2>
      <ul>
        {datas.map(data => (
          <li key={data.id} onClick={() => onSelect(data.id)}>
            {data.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DataList;
