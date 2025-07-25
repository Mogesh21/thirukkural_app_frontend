import React, { useEffect, useState } from 'react';
import { Table, Button, Space, notification, Popconfirm, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'config/axiosConfig';

const AuthorsList = () => {
  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);

  const fetchAuthors = async () => {
    try {
      const response = await axiosInstance.get('/authors');
      setAuthors(response.data.data);
    } catch (err) {
      notification.error({ message: 'Unable to get Authors', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        authors.filter(
          (author) =>
            author.tamil_name.toLowerCase().includes(search.toLowerCase()) || author.eng_name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredData(authors);
    }
  }, [authors, search]);

  const columns = [
    {
      title: 'SNO',
      render: (_, record, index) => <div style={{ width: 'max-content', textWrap: 'nowrap' }}>{index + 1}</div>
    },
    {
      title: 'Tamil Name',
      dataIndex: 'tamil_name',
      key: 'tamil_name'
    },
    {
      title: 'English Name',
      dataIndex: 'eng_name',
      key: 'eng_name'
    },
    {
      title: 'Status',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            onClick={() => handleUpdate(record)}
            style={{ backgroundColor: record.status === 1 ? '#08d007' : '#dd0621', justifySelf: 'center' }}
          >
            {record.status === 1 ? 'Active' : 'Inactive'}{' '}
          </Button>
        </div>
      )
    },
    {
      title: 'Options',
      key: 'options',
      render: (text, record) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              onClick={() => handleEdit(authors.find((author) => author.id === record.id))}
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
    navigate('/app/dashboard/authors/edit-author', { state: { record } });
  };

  const handleUpdate = async (values) => {
    values.status = values.status === 1 ? 0 : 1;
    try {
      const response = await axiosInstance.put(`/authors/${values.id}`, values);

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
      const response = await axiosInstance.delete(`/authors/${record.id}`);
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

export default AuthorsList;
