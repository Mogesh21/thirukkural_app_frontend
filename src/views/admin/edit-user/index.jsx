import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Layout, notification, Upload } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import axiosInstance from 'config/axiosConfig';
import { SERVER_ADDRESS } from 'config/constant';
import './EditUser.scss';

function EditUser() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (state && state.elem.avatar && state.elem.avatar !== 'default.png') {
      setFileList([
        {
          uid: '-1',
          name: 'Profile Image',
          status: 'done',
          url: `${SERVER_ADDRESS}/public/profile/${state.elem.avatar}`,
          thumbUrl: `${SERVER_ADDRESS}/public/profile/${state.elem.avatar}`
        }
      ]);
    }
  }, [state]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (fileList.length > 0) {
        if (fileList[0].originFileObj) {
          formData.append('avatar', fileList[0].originFileObj);
          formData.append('remove_image', 1);
        }
      } else {
        formData.append('remove_image', 1);
      }
      formData.append('id', state.elem.id);
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('old_image', state.elem.avatar);

      const response = await axiosInstance.post(`/user/edituser`, formData, {
        'Content-Type': 'multipart/form-data'
      });
      if (response.status === 200) {
        notification.success({ message: 'User updated successfully' });
        navigate('/app/dashboard/admin/users');
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (error) {
      console.error('Error updating user', error);
      notification.error({ message: 'Failed to update user' });
    }
    setLoading(false);
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  const uploadProps = {
    height: '2rem',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png,.webp',
    maxCount: 1,
    beforeUpload: (file) => {
      return false;
    },
    onChange: handleChange,
    fileList
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white' }}>
      <p style={{ fontSize: '1.5rem', padding: '.5rem' }}>Edit Details</p>
      <Form
        form={form}
        {...layout}
        name="basic"
        initialValues={{
          name: state?.elem.name,
          email: state?.elem.email
        }}
        onFinish={onSubmit}
      >
        <Form.Item label="Profile Image" name="avatar">
          <Upload {...uploadProps}>
            <Button className="uploadButton">
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Please input your name!' },
            { max: 20, message: 'Name is must be less than 20 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const errors = [];
                const uppercaseRegex = /^(?=.*[A-Z]).+$/;
                const lowercaseRegex = /^(?=.*[a-z]).+$/;
                const digitRegex = /^(?=.*\d).+$/;
                const specialCharRegex = /^(?=.*[@$!%*?&]).+$/;
                const lengthRegex = /^.{8,}$/;

                if (!value) {
                  return Promise.resolve();
                } else {
                  if (!uppercaseRegex.test(value)) errors.push('Uppercase letter');
                  if (!lowercaseRegex.test(value)) errors.push('Lowercase letter');
                  if (!digitRegex.test(value)) errors.push('One digit');
                  if (!specialCharRegex.test(value)) errors.push('Special character (@$!%*?&)');
                  if (!lengthRegex.test(value)) errors.push('8 characters long');

                  if (errors.length > 0) return Promise.reject(errors);
                  return Promise.resolve();
                }
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="c_password"
          dependencies={['password']}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Password Mismatch!'));
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
}

export default EditUser;
