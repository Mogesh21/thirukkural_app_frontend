import React, { useEffect, useState } from 'react';
import { Form, Input, Button, notification, Layout, Select, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';
import readXlsxFile from 'read-excel-file';

const index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState([]);
  const [excelFile, setExcelFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState([]);
  const columns = ['kural_no', 'tam_porul', 'eng_porul', 'author_id', 'tam_explanation', 'eng_explanation'];

  const fetchAuthors = async () => {
    try {
      const response = await axiosInstance.get('/authors');
      setAuthors(response.data.data);
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to fetch authors! Please reload the page' });
    }
  };

  const onFinish = async () => {
    if (errors.length > 0) return;
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/kurals`, { data });

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

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (excelFile) readFile(excelFile);
  }, [excelFile]);

  const readFile = async (file) => {
    const data = await readXlsxFile(file);
    const header = data[0];
    const error = [];
    if (!header[0] || header[0] !== columns[0]) {
      error.push('First column must be kural_no');
    }
    if (!header[1] || header[1] !== columns[1]) {
      error.push('Second column must be tam_porul');
    }
    if (!header[2] || header[2] !== columns[2]) {
      error.push('Third column must be eng_porul');
    }
    if (!header[3] || header[3] !== columns[3]) {
      error.push('Fourth column must be author_id');
    }
    if (!header[4] || header[4] !== columns[4]) {
      error.push('Fifth column must be tam_explanation');
    }
    if (!header[5] || header[5] !== columns[5]) {
      error.push('Sixth column must be eng_explanation');
    }
    if (error.length === 0) {
      const records = data.slice(1);
      const result = records.map((row) => {
        if (!authors.find((val) => val.id == row[3])) error.push(`Author not found for kural (${row[0]})`);
        if (row[0] > 1330 || row[0] < 1) {
          error.push(`Kural no is wrong for (${row[0]})`);
        }
        return Object.fromEntries(columns.map((key, index) => [key, row[index]]));
      });
      if (error.length === 0) setData(result);
    }
    setErrors(error);
  };

  const handleFileChange = (file) => {
    setExcelFile(file.file);
  };

  const uploadProps = {
    height: '2rem',
    listType: 'picture',
    accept: '.xlsx, .xls',
    maxCount: 1,
    beforeUpload: (file) => {
      return false;
    },
    onChange: handleFileChange,
    setExcelFile
  };

  return (
    <Layout className="layout" style={{ backgroundColor: 'white', borderRadius: '10px' }}>
      <p style={{ fontSize: '1.3rem', fontWeight: '500', padding: '.5rem', textDecoration: 'underline' }}>Add Kural Explanations</p>
      <Form labelCol={{ span: 8 }} wrapperCol={{ span: 12 }} style={{ margin: '1rem' }} layout="horizontal" onFinish={onFinish}>
        <Form.Item label="Kural Data" name="kural_data">
          <Upload {...uploadProps}>
            <Button>Upload</Button>
          </Upload>
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: '5px' }}>
            {errors.map((error) => (
              <span style={{ color: 'red', fontSize: '12px' }}>{error}</span>
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
