// import React, { useState } from 'react';
// import axios from 'axios';

// const App = () => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('photo', file);

//     try {
//       await axios.post('http://localhost:5000/upload', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });
//       console.log('File uploaded successfully');
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };


// };

// export default App;
