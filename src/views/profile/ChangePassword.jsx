import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import './profile.scss';
import { jwtDecode } from 'jwt-decode';
import axiosInstance from 'config/axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { setToken } from 'store/authSlice';

const ChangePassword = () => {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      if (values.newPassword) {
        const userData = jwtDecode(token).data;
        const formData = new FormData();
        formData.append('id', userData.id);
        formData.append('name', userData.name);
        formData.append('email', userData.email);
        formData.append('old_image', userData.avatar);
        formData.append('current_password', values.currentPassword);
        formData.append('new_password', values.newPassword);

        const response = await axiosInstance.post(`/user/edituser`, formData, {
          'Content-Type': 'multipart/form-data'
        });
        if (response.status === 200) {
          const token = response.data.token;
          const actualToken = token.startsWith('Bearer ') ? token.split(' ')[1] : token;
          localStorage.setItem('token', actualToken);
          dispatch(setToken(actualToken));
          form.resetFields();
          notification.success({ message: 'Password changed successfully' });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        notification.error({ message: 'Current Password is incorrect' });
      } else {
        notification.error({ message: error.message });
      }
    }
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: '17rem' }}>
        <Form.Item
          label="Current Password"
          name="currentPassword"
          rules={[{ required: true, message: 'Please enter your current password' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="newPassword"
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
          label="Confirm New Password"
          name="confirmNewPassword"
          rules={[
            {
              required: true,
              message: 'Please Enter your new Password again'
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Password Mismatch!'));
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button className="submit-change-password" type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;
