import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RatingForm = () => {
  const [users, setUsers] = useState([]);
  const [datas, setDatas] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedData, setSelectedData] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchDatas();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchDatas = async () => {
    try {
      const response = await axios.get('http://localhost:3000/apip/datas');
      setDatas(response.data);
    } catch (error) {
      console.error('Error fetching datas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/userrating_new', {
        dataid: selectedData,
        userid: selectedUser,
        description: description,
        rating: rating
      });
      // Optionally, you can show a success message or reset the form here
    } catch (error) {
      console.error('Error adding user rating:', error);
    }
  };

  return (
    <div>
      <h2>Add Rating</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="user">Select User:</label>
          <select id="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="data">Select Data:</label>
          <select id="data" value={selectedData} onChange={(e) => setSelectedData(e.target.value)}>
            <option value="">Select Data</option>
            {datas.map(data => (
              <option key={data.id} value={data.id}>{data.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input type="number" id="rating" min="1" max="5" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Submit Rating</button>
      </form>
    </div>
  );
};

export default RatingForm;
