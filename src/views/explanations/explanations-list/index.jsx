import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Input, Checkbox } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const index = () => {
  const navigate = useNavigate();
  const [explanations, setExplanations] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchExplanations = async () => {
    try {
      const response = await axiosInstance.get('/kurals');
      setExplanations(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Authors', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanations();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(explanations.filter((explanation) => explanation.kural_no == search.toLowerCase()));
    } else {
      setFilteredData(explanations);
    }
  }, [explanations, search]);

  const columns = [
    {
      title: 'Kural No',
      dataIndex: 'kural_no',
      key: 'kural_no'
    },
    {
      title: 'Explanations',
      render: (text, record) => {
        return (
          <Space size="middle" style={{ display: 'flex', alignItems: 'start', flexDirection: 'column' }}>
            {console.log(record.explanations)}
            {record.explanations &&
              record.explanations.map((explanation) => (
                <div key={explanation.author_id} style={{ display: 'flex', gap: '1rem' }}>
                  <p style={{ minWidth: '9rem' }}>{explanation.eng_name} :</p>
                  <div>
                    Tamil : <Checkbox checked={explanation.tam_explanation} disabled />
                  </div>
                  <div>
                    English : <Checkbox checked={explanation.eng_explanation} disabled />
                  </div>
                </div>
              ))}
          </Space>
        );
      }
    },
    {
      title: 'Options',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEdit(explanations.find((explanation) => explanation.id === record.id))}
              style={{ backgroundColor: '#1DCCDE' }}
            >
              Edit
            </Button>
            {/* <Popconfirm
              title="Delete the Author"
              description="Are you sure to delete this Author?"
              onConfirm={() => handleDelete(record)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm> */}
          </Space>
        );
      }
    }
  ];

  const handleEdit = (record) => {
    navigate('/app/dashboard/explanations/edit-explanation', { state: record });
  };

  const handleUpdate = async (values) => {
    values.status = values.status === 1 ? 0 : 1;
    try {
      const response = await axiosInstance.put(`/explanations/${values.id}`, values);

      if (response.status === 200) {
        fetchAuthors();
        notification.success({
          message: 'Status changed successfully'
        });
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error(err);
      notification.error({
        message: 'Error occurred',
        description: 'Unable to update status. Please try again.'
      });
    }
  };

  const handleDelete = async (record) => {
    try {
      const response = await axiosInstance.delete(`/explanations/${record.id}`);
      if (response.status === 200) {
        notification.success({ message: 'Success', description: 'Author deleted sucessfully' });
        fetchAuthors();
      } else {
        throw response.data.message;
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Server Error', description: 'Unable to delete! Please try again...' });
    }
  };

  return (
    <div className="page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>
    </div>
  );
};

export default index;
