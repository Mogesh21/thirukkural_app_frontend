import React, { useEffect, useState } from 'react';
import { Table, Button, Avatar, notification, Space, Popconfirm } from 'antd';
import { Alert } from 'antd';
import DefaultImage from '../../../assets/images/default.png';
import { useNavigate } from 'react-router-dom';
import { SERVER_ADDRESS } from 'config/constant';
import './Users.scss';
import axiosInstance from 'config/axiosConfig';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/user`);
      setUsers(response.data.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      notification.error({ message: 'Failed to fetch users' });
    }
  };

  useEffect(() => {
    const waiting = async () => {
      await fetchUsers();
      setLoading(false);
    };
    waiting();
  }, []);

  const handleEdit = (elem) => {
    navigate('/app/dashboard/admin/edit-user', {
      state: { elem: elem }
    });
  };

  const handleDelete = async (id) => {
    try {
      const response = await axiosInstance.delete(`/user/deleteuser/${id}`);
      if (response.status === 200) {
        notification.success({ message: `User Deleted...` });
        fetchUsers();
      } else {
        notification.error({ message: response.data.message });
      }
    } catch (err) {
      console.log(err);
      notification.error({ message: 'Unable to delete user' });
      <Alert message="Error" description={err} type="error" showIcon />;
    }
  };

  const tableColumns = [
    {
      title: 'Id',
      dataIndex: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id
      }
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      render: (_, elm) => (
        <div>
          <Avatar shape="circle" size="large" src={elm.avatar ? `${SERVER_ADDRESS}/public/profile/${elm.avatar}` : DefaultImage} />
        </div>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a > b ? -1 : b > a ? 1 : 0;
        }
      }
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Options',
      dataIndex: 'options',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleEdit(record)} style={{ backgroundColor: '#1DCCDE' }}>
            Edit
          </Button>
          <Popconfirm
            title="Delete the device"
            description="Are you sure to delete this device?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="users">
      <div className="container">
        <Table loading={loading} columns={tableColumns} dataSource={users} rowKey="id" />
      </div>
    </div>
  );
};

export default Admin;
