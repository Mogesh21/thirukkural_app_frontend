import React, { useState } from 'react';
import { Row, Col, Form, Input, Button, Alert, notification } from 'antd';
import { logIn } from 'store/authSlice';
import { useDispatch } from 'react-redux';
import './JWTlogin.scss';
import { useNavigate } from 'react-router-dom';

const JWTLogin = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const resultAction = await dispatch(logIn(values));
      if (logIn.fulfilled.match(resultAction)) {
        notification.success({
          message: 'Login Successful',
          description: 'You have successfully logged In'
        });
        navigate('/app/dashboard/categories/categories-list');
      } else {
        if (resultAction.payload) {
          notification.error({
            message: 'Login Failed',
            description: resultAction.payload.message
          });
        } else {
          notification.error({
            message: 'Login Failed',
            description: 'An unknown error occurred. Please try again.'
          });
        }
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Login Error',
        description: 'An error occurred. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        email: '',
        password: ''
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please enter your Email!'
          },
          {
            type: 'email',
            message: 'Please enter a valid Email!'
          }
        ]}
      >
        <Input className="form-input" placeholder="Email Address" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please enter your password!'
          }
        ]}
      >
        <Input.Password className="form-input" placeholder="Password" />
      </Form.Item>

      {form.getFieldError('submit').length > 0 && (
        <Col span={12}>
          <Alert message={form.getFieldError('submit')} type="error" />
        </Col>
      )}

      <Row>
        <Col span={23}>
          <Button type="primary" htmlType="submit" loading={loading} size="large" className="mb-4" style={{ backgroundColor: '#1ECDD3' }}>
            Log In
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default JWTLogin;
