import React, { useState } from 'react';
import RatingForm from './RatingForm';
import DataList from './DataList';
import DataRating from './DataRating';

const App = () => {
  const [selectedData, setSelectedData] = useState(null);

  const handleDataSelect = (dataId) => {
    setSelectedData(dataId);
  };

  return (
    <div>
      <h1>Product Ratings</h1>
      <RatingForm />
      <DataList onSelect={handleDataSelect} />
      {selectedData && <DataRating dataId={selectedData} />}
    </div>
  );
};

export default App;
