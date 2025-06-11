import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ProfilePage() {
  const [profile, setProfile] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios.get('/user/profile')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  const upload = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('avatar', file);
    const res = await axios.post('/user/profile/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    setProfile(p => ({ ...p, profile_image: res.data.imageUrl }));
  };

  return (
    <div className="profile-page p-4">
      <img
        src={profile.profile_image}
        alt="Avatar"
        className="w-24 h-24 rounded-full mb-2"
      />
      <h2 className="text-xl font-bold">{profile.telegram_id}</h2>
      <input
        type="file"
        accept="image/*"
        onChange={e => setFile(e.target.files[0])}
      />
      <button className="mt-2 p-2 bg-green-500 text-white" onClick={upload}>
        Upload Avatar
      </button>
    </div>
  );
}
