import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Layout, Upload, message } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const EditAuthor = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { state } = location;

  useEffect(() => {
    if (state?.record) {
      form.setFieldsValue({
        tamil_name: state.record.tamil_name,
        eng_name: state.record.eng_name
      });
    }
  }, [state, form]);

  // Submit updated category
  const onFinish = async (values) => {
    values.status = state.record.status;
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/authors/${state.record.id}`, values);

      if (response.status === 200) {
        notification.success({
          message: 'Author updated successfully'
        });
        navigate('/app/dashboard/authors/authors-list');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update category. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Edit Category</p>
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
          <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#1DCCDE' }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Layout>
  );
};

export default EditAuthor;
