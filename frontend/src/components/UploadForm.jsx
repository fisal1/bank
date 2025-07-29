import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [tag, setTag] = useState('');
  const [version, setVersion] = useState('');

  const handleUpload = async () => {
    if (!file || !tag || !version) {
      alert('File, tag, and version are required');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tag', tag);
    formData.append('version', version);
    await axios.post('http://localhost:8000/api/upload', formData);
    alert('Upload successful');
    setFile(null); setTag(''); setVersion('');
  };

  return (
    <div className="upload-form">
      <h2>Upload Document</h2>
      <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} />
      <input value={tag} onChange={e => setTag(e.target.value)} placeholder="Tag (e.g., FX Policy)" />
      <input value={version} onChange={e => setVersion(e.target.value)} placeholder="Version (e.g., v1.0)" />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
