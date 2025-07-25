import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Layout, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const index = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // const [data, setData] = useState(null);
  const [authors, setAuthors] = useState([]);
  const [explanations, setExplanations] = useState([]);
  const { state } = location;

  const fetchExplanations = async (id) => {
    try {
      const response = await axiosInstance.get(`/kurals/${id}`);
      if (response.data.data) {
        const details = response.data.data;
        // setData(details);
        form.setFieldsValue({
          kural_no: details.kural_no,
          tam_porul: details.tam_porul,
          eng_porul: details.eng_porul
        });
        setExplanations(details.explanations);
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Please reload the page' });
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await axiosInstance.get('/authors');
      setAuthors(response.data.data);
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to fetch authors! Please reload the page' });
    }
  };

  useEffect(() => {
    fetchAuthors();
    if (state?.kural_no) {
      fetchExplanations(state.kural_no);
    }
  }, [state, form]);

  const onFinish = async (values) => {
    values.explanations = explanations;
    console.log(values);
    setLoading(true);
    try {
      const response = await axiosInstance.put(`/kurals/${values.kural_no}`, values);

      if (response.status === 200) {
        notification.success({
          message: 'Kural updated successfully'
        });
        navigate('/app/dashboard/explanations/explanations-list');
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update kural. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const onExplanationChange = (value, author_id, key) => {
    setExplanations((prev) => {
      const index = prev.findIndex((exp) => exp.author_id === author_id);

      if (index !== -1) {
        return prev.map((exp) =>
          exp.author_id === author_id
            ? {
                ...exp,
                [key]: value
              }
            : exp
        );
      } else {
        return [
          ...prev,
          {
            author_id,
            tam_explanation: '',
            eng_explanation: '',
            [key]: value
          }
        ];
      }
    });
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Edit Kural Details</p>
      <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item label="Kural Number" name="kural_no" rules={[{ required: true, message: 'Please select the kural!' }]}>
          <Select disabled></Select>
        </Form.Item>
        <Form.Item
          label="Tamil Word explanation"
          name="tam_porul"
          rules={[{ required: true, message: 'Please enter the tamil explanation!' }]}
        >
          <Input.TextArea rows={7} />
        </Form.Item>
        <Form.Item
          label="English Word explanation"
          name="eng_porul"
          rules={[{ required: true, message: 'Please enter the english explanation!' }]}
        >
          <Input.TextArea rows={7} />
        </Form.Item>
        <Form.Item label="Explanations" rules={[{ required: true, message: 'Please enter the english explanation!' }]}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {authors.map((author) => (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                <Input disabled value={author.eng_name} />
                <div style={{ display: 'flex', gap: '5px', width: '100%', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100%', gap: '3px' }}>
                    <span>Tamil Explanation</span>
                    <Input.TextArea
                      rows={3}
                      value={explanations.find((val) => val.author_id === author.id)?.tam_explanation ?? ''}
                      onChange={(e) => onExplanationChange(e.target.value, author.id, 'tam_explanation')}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', minWidth: '100%', gap: '3px' }}>
                    <span>English Explanation</span>
                    <Input.TextArea
                      rows={3}
                      value={explanations.find((val) => val.author_id === author.id)?.eng_explanation ?? ''}
                      onChange={(e) => onExplanationChange(e.target.value, author.id, 'eng_explanation')}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
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

export default index;
