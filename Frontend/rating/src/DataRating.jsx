import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataRating = ({ dataId }) => {
  const [dataRating, setDataRating] = useState(null);

  useEffect(() => {
    fetchAverageRating();
  }, [dataId]);

  const fetchAverageRating = async () => {
    try {
      const response = await axios.get(`/dataratings/${dataId}`);
      setDataRating(response.data);
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  };

  return (
    <div>
      <h2>Data Rating</h2>
      {dataRating ? (
        <div>
          <p>Data ID: {dataRating.dataid}</p>
          <p>Average Rating: {dataRating.rating}</p>
          <p>Rating out of: {dataRating.ratingoutof}</p>
        </div>
      ) : (
        <p>No rating available for this data</p>
      )}
    </div>
  );
};

export default DataRating;
