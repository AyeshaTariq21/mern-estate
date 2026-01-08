// import { useSelector } from 'react-redux';
// import { useRef, useState, useEffect } from 'react';
// import {
//   getDownloadURL,
//   getStorage,
//   ref,
//   uploadBytesResumable,
// } from 'firebase/storage';
// import { app } from '../firebase';

// function Profile() {
//    const fileRef = useRef(null)
//    const {currentUser} = useSelector((state) => state.user)
//    const [file, setFile] = useState(undefined)
//    const [filePerc, setFilePerc] = useState(0);
//    const [fileUploadError, setFileUploadError] = useState(false);
//    const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (file) {
//       handleFileUpload(file);
//     }
//   }, [file]);

//   const handleFileUpload = (file) =>{
//      const storage = getStorage(app);
//      const fileName = new Date().getTime() + file.name;
//      const storageRef = ref(storage, fileName);
//      const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//       'state_changed',
//       (snapshot) => {
//         const progress =
//           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//         setFilePerc(Math.round(progress));
//       },
//       (error) => {
//         setFileUploadError(true);
//       },
//       () => {
//         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
//           setFormData({ ...formData, avatar: downloadURL })
//         );
//       }
//     );
//   }
//   return (
//    <div className='p-3 max-w-lg mx-auto'>
//       <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
//       <form className='flex flex-col gap-4'>
//        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
//         <img onClick={()=>fileRef.current.click()} src={currentUser.avatar} alt="profile" className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2" />
//         <input type="text" placeholder="username" id="username" className=" border p-3 rounded-lg"/>
//         <input type="email" placeholder="email" id="email" className=" border p-3 rounded-lg"/>
//         <input type="text" placeholder="password" id="password" className=" border p-3 rounded-lg"/>
//         <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
//       </form>
//       <div className="flex justify-between mt-5">
//         <span className="text-red-700 cursor-pointer">Delete account</span>
//         <span className="text-red-700 cursor-pointer">Sign out</span>
//       </div>
//     </div>
//   )
// }

// export default Profile

import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    avatar: currentUser.avatar,
  });

  // Upload image when file changes
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  // const handleFileUpload = async (file) => {
  //   try {
  //     setFileUploadError(false);
  //     setFilePerc(0);

  //     const data = new FormData();
  //     data.append('file', file);
  //     data.append('upload_preset', 'mern-estate'); // 🔴 replace
  //     data.append('cloud_name', 'dswzycd8q'); // 🔴 replace

  //     const res = await fetch(
  //       'https://api.cloudinary.com/v1_1/dswzycd8q/image/upload',
  //       {
  //         method: 'POST',
  //         body: data,
  //       }
  //     );
  //     const result = await res.json();
  //     if (!result.secure_url) {
  //       throw new Error('Upload failed');
  //     }
  //     setFormData((prev) => ({
  //       ...prev,
  //       avatar: result.secure_url,
  //     }));

  //     setFilePerc(100);
  //   } catch (error) {
  //     console.error(error);
  //     setFileUploadError(true);
  //   }
  // };

const handleSubmit = async (e) => {
  e.preventDefault();

  console.log('Submitting data:', formData); // 👈 IMPORTANT

  try {
    const res = await fetch(`/api/user/update/${currentUser._id}`, {
      method: 'PUT', // 👈 USE PUT (important)
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    console.log('Response from backend:', data); // 👈 IMPORTANT

    if (!res.ok) {
      throw new Error(data.message || 'Update failed');
    }

    dispatch(signInSuccess(data));
  } catch (error) {
    console.error('Update error:', error);
  }
};

const handleFileUpload = async (file) => {
  try {
    setFileUploadError(false);
    setFilePerc(0);

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'mern-estate');

    const res = await axios.post(
      'https://api.cloudinary.com/v1_1/dswzycd8q/image/upload',
      data,
      {
        onUploadProgress: (progressEvent) => {
       const total = progressEvent.total || progressEvent.loaded;
       const percent = Math.round((progressEvent.loaded * 100) / total);
       setFilePerc(percent);
       },
      }
    );

    setFormData((prev) => ({
      ...prev,
      avatar: res.data.secure_url,
    }));
  } catch (error) {
    console.error(error);
    setFileUploadError(true);
  }
};

const handleChange = (e) => {
  setFormData((prev) => ({
    ...prev,
    [e.target.id]: e.target.value,
  }));
};

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
       <p className="text-sm self-center">
        {fileUploadError ?
          (<span className="text-red-700">Error image upload(image must be less than 2 mb)</span>) :
           filePerc > 0 && filePerc < 100 ? (
          <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>) :
           filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded!</span>
          ) :
          ""
        }
       </p>

        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />

        <button type="submit" className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          update
        </button>
      </form>

      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
