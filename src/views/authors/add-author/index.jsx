import React, { useState } from 'react';
import { Form, Input, Button, notification, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const AddAuthor = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post('/authors', values);
      if (response.status === 201) {
        notification.success({
          message: 'Author created successfully'
        });
        navigate('/app/dashboard/authors/authors-list');
      } else {
        throw new Error('Unable to create');
      }
    } catch (err) {
      console.log(err);
      notification.error({
        message: 'Error Occured....',
        description: 'Unable to create! Please try again...'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add New Author</p>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item
          label="Tamil Name"
          name="tamil_name"
          rules={[
            { required: true, message: 'Please enter the name!' },
            { max: 50, message: 'Name cannot be longer than 50 characters!' }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="English Name"
          name="eng_name"
          rules={[
            { required: true, message: 'Please enter the name!' },
            { max: 50, message: 'Name cannot be longer than 50 characters!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ backgroundColor: '#1DCCDE' }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default AddAuthor;
