import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Upload, message } from 'antd';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { memo, useEffect, useState } from 'react';
import { storage } from '../configs/firebase';
import { getBase64 } from '../utils';

const UploadImage = (props) => {
  const { onFileChange, initialImage, titleButton, onUploadingChange } = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [file, setFile] = useState(null);
  const [fileChange, setFileChange] = useState('');
  const [uploading, setUploading] = useState(false);

  // gọi callback ra ngoài khi trạng thái upload thay đổi
  useEffect(() => {
    if (onUploadingChange) {
      onUploadingChange(uploading);
    }
  }, [uploading, onUploadingChange]);

  // gọi callback ra ngoài khi file thay đổi (trả về url ảnh)
  useEffect(() => {
    onFileChange(fileChange);
  }, [fileChange, onFileChange]);

  // nếu có ảnh khởi tạo thì set vào state
  useEffect(() => {
    if (initialImage) {
      setFile({
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: initialImage,
      });
      setFileChange(initialImage);
    }
  }, [initialImage]);

  // cử lý khi click preview ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  // xử lý khi chọn file mới hoặc xóa file
  const handleChange = async ({ fileList: newFileList }) => {
    const newFile = newFileList.length ? newFileList[0] : null;
    setFile(newFile);

    if (newFileList.length === 0) {
      setFile(null);
      setFileChange('');
      setUploading(false);
      return;
    }

    // nếu có file mới thì upload lên firebase
    if (newFile && newFile.originFileObj) {
      try {
        setUploading(true);
        message.loading({ content: 'Đang tải ảnh lên...', key: 'uploading' });

        // tạo đường dẫn lưu trữ trên firebase
        const storageRef = ref(
          storage,
          `/SmartLawGT/${Date.now()}_${newFile.name}`,
        );
        await uploadBytes(storageRef, newFile.originFileObj);
        const downloadURL = await getDownloadURL(storageRef);

        newFile.status = 'done';
        newFile.url = downloadURL;
        setFileChange(downloadURL);

        message.success({
          content: 'Tải ảnh lên thành công',
          key: 'uploading',
        });
      } catch (error) {
        console.error('Upload error:', error);
        newFile.status = 'error';
        message.error({ content: 'Lỗi khi tải ảnh lên!', key: 'uploading' });
      } finally {
        setUploading(false);
      }
    }
  };

  const uploadButton = (
    <button
      style={{ border: 0, background: 'none' }}
      type="button"
      className="upload-button"
      disabled={uploading}
    >
      {uploading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>
        {uploading ? 'Đang tải...' : titleButton}
      </div>
    </button>
  );

  return (
    <div className="upload-image-container">
      <Upload
        listType="picture-circle"
        fileList={file ? [file] : []}
        onPreview={handlePreview}
        onChange={handleChange}
        accept="image/*"
        beforeUpload={() => false}
        disabled={uploading}
        showUploadList={{
          showPreviewIcon: true,
          showRemoveIcon: !uploading,
        }}
      >
        {file ? null : uploadButton}
      </Upload>

      {previewOpen && previewImage && (
        <Image
          alt="Preview"
          style={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => {
              setPreviewOpen(visible);
              if (!visible) {
                setPreviewImage('');
              }
            },
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};

export default memo(UploadImage);
