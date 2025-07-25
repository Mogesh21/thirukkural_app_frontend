import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Upload, Image, Row, Col, notification } from 'antd';
import DefaultImg from '../../assets/images/default.png';
import { jwtDecode } from 'jwt-decode';
import { useDispatch, useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'config/axiosConfig';
import { setToken } from 'store/authSlice';

const EditProfile = () => {
  const [image, setImage] = useState('');
  const [form] = Form.useForm();
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    const decoded = jwtDecode(token).data;
    setUserData(decoded);
    form.setFieldsValue({
      name: decoded.name,
      email: decoded.email
    });
    setImage(decoded.avatar);
  }, [token]);

  const onUploadAvatar = async (info) => {
    try {
      const formData = new FormData();
      if (info.file) {
        formData.append('avatar', info.file);
        formData.append('id', userData.id);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('old_image', userData.avatar);

        const response = await axiosInstance.post(`/user/edituser`, formData, {
          'Content-Type': 'multipart/form-data'
        });
        if (response.status === 200) {
          localStorage.setItem('token', response.data.token.split(' ')[1]);
          setToken(response.data.token.split(' ')[1]);
          notification.success({ message: 'Profile Picture Changed' });
          const token = response.data.token.split(' ')[1];
          dispatch(setToken(token));
          const decoded = jwtDecode(token).data;
          setUserData(decoded);
          setImage(decoded.avatar);
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: 'An error occured!!', description: 'Please try again...' });
    }
  };

  const onFinish = async (values) => {
    try {
      const formData = new FormData();
      formData.append('id', userData.id);
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('old_image', userData.avatar);

      const response = await axiosInstance.post(`/user/edituser`, formData, {
        'Content-Type': 'multipart/form-data'
      });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token.split(' ')[1]);
        setToken(response.data.token.split(' ')[1]);
        notification.success({ message: 'User Data Updated' });
        const token = response.data.token.split(' ')[1];
        dispatch(setToken(token));
        const decoded = jwtDecode(token).data;
        setUserData(decoded);
        setImage(decoded.avatar);
        setShowSubmit(false);
      }
    } catch (error) {
      notification.error({ message: error.message });
    }
  };

  const onRemoveAvatar = async () => {
    try {
      const formData = new FormData();
      formData.append('id', userData.id);
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('old_image', userData.avatar);
      formData.append('remove_image', 1);

      const response = await axiosInstance.post(`/user/edituser`, formData, {
        'Content-Type': 'multipart/form-data'
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token.split(' ')[1]);
        setToken(response.data.token.split(' ')[1]);
        notification.success({ message: 'Profile Picture Removed' });
        const token = response.data.token.split(' ')[1];
        dispatch(setToken(token));
        const decoded = jwtDecode(token).data;
        setUserData(decoded);
        setImage(decoded.avatar);
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      notification.error({ message: 'An error occured!!', description: 'Please try again...' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
        <Image src={image ? image : DefaultImg} width={80} height={80} style={{ borderRadius: '50%' }} />
        <div style={{ marginTop: '16px' }}>
          <Upload beforeUpload={() => false} onChange={onUploadAvatar} showUploadList={false}>
            <Button icon={<UploadOutlined />} type="primary" style={{ margin: '10px' }}>
              Change Avatar
            </Button>
          </Upload>
          {image && (
            <Button danger onClick={onRemoveAvatar} style={{ margin: '10px' }}>
              Remove
            </Button>
          )}
        </div>
      </div>
      <div style={{ width: '100%', justifyContent: 'center' }}>
        <Form layout="vertical" form={form} onFinish={onFinish} onChange={() => setShowSubmit(true)}>
          <Row gutter={30}>
            <Col xs={30} sm={30} md={12}>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={30} sm={30} md={12}>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}>
                <Input type="email" />
              </Form.Item>
            </Col>
          </Row>
          {showSubmit && (
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};

export default EditProfile;
