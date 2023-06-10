import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'
import axios from 'axios';

const dropzoneStyle = {
    width: '300px',
    height: '200px',
    border: '2px dashed #bbb',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
};

const dropzoneContentStyle = {
    textAlign: 'center',
    color: '#777',
};


const AvatarUpload = (props) => {
    const { onChange } = props;
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(props?.record?.params?.avatar)
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, [])

    const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: 'image/*' })

    const handleUpload = async () => {
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await axios.post('/api/user/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                const { data } = response;

                const filePath = window.location.origin + "\\" + data.filePath
                // Update the record with the file path
                onChange('avatar', filePath)

                setImage(filePath)
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        handleUpload()
    }, [file])


    return (
        <div>
            <div style={{ width: "100%" }}>
                <img src={`${image?.replace('\\public','/public')}`} style={{ height: 100, margin: 'auto' }} alt="" />
            </div>
            <div {...getRootProps()}>
                <input {...getInputProps()} accept="image/*" />
                <div style={dropzoneStyle}>
                    <div style={dropzoneContentStyle}>
                        {file ?
                            <p>File uploaded {file?.path}</p> :
                            <p>Drag 'n' drop some files here, or click to select files</p>}
                    </div>
                </div>
            </div>
            <br />
            <br />
        </div>
    );
};

export default AvatarUpload;
