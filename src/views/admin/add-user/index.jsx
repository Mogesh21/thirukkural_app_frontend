import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Layout, message, notification, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import './AddUser.scss';
import axiosInstance from 'config/axiosConfig';

function AddUser() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user');
      if (response.status === 200) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to fetch Data', description: 'Please refresh the page' });
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const formData = new FormData();
      if (values.avatar) formData.append('avatar', values.avatar.file);
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('password', values.password);
      formData.append('values', JSON.stringify(values));
      const response = await axiosInstance.post(`/user/register`, formData, {
        'Content-Type': 'multipart/form-data'
      });
      if (response.status === 400) {
        notification.error({ message: response.data.message });
      } else if (response.status === 201) {
        notification.success({ message: 'User Created successfully' });
        navigate('/app/dashboard/admin/users');
      } else {
        notification.error('Failed to create user!');
      }
    } catch (error) {
      console.error('Error creating user', error);
      notification.error({ message: 'Failed to create user...Please try again!' });
    }
    setLoading(false);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 }
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  };

  const props = {
    height: '2rem',
    listType: 'picture',
    accept: '.jpg,.jpeg,.png,.webp',
    maxCount: 1,
    beforeUpload: (file) => {
      const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
      if (!isValidType) {
        message.error('You can only upload JPG, JPEG, PNG, or WEBP files!');
        setFileValid(false);
        return false;
      }
      setFileValid(true);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white' }}>
      <p style={{ fontSize: '1.5rem', padding: '.5rem' }}>Fill Details</p>
      <Form form={form} {...layout} name="basic" onFinish={onSubmit}>
        <Form.Item label="Profile Image" name="avatar" >
          <Upload {...props}>
            <Button className="uploadButton">
              <UploadOutlined /> Upload
            </Button>
          </Upload>
        </Form.Item>
        <Form.Item
          label="Username"
          name="name"
          rules={[
            { required: true, message: 'Please input your username!' },
            { max: 20, message: 'Username is must be less than 20 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          type="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            () => ({
              validator(rule, val) {
                if (val && users.filter((user) => user.email === val).length > 0) return Promise.reject('Email already exists');
                else return Promise.resolve();
              }
            })
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: ''
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                const errors = [];

                const uppercaseRegex = /^(?=.*[A-Z]).+$/;
                const lowercaseRegex = /^(?=.*[a-z]).+$/;
                const digitRegex = /^(?=.*\d).+$/;
                const specialCharRegex = /^(?=.*[@$!%*?&]).+$/;
                const lengthRegex = /^.{8,}$/;

                if (!uppercaseRegex.test(value)) {
                  errors.push('Uppercase letter');
                }
                if (!lowercaseRegex.test(value)) {
                  errors.push('Lowercase letter');
                }
                if (!digitRegex.test(value)) {
                  errors.push('One digit');
                }
                if (!specialCharRegex.test(value)) {
                  errors.push('Special character (@$!%*?&)');
                }
                if (!lengthRegex.test(value)) {
                  errors.push('8 characters long');
                }

                if (errors.length > 0) {
                  return Promise.reject(errors);
                }

                return Promise.resolve();
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
            {
              required: true,
              message: 'Please Enter your new Password again'
            },
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

export default AddUser;
