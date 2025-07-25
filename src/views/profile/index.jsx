import React, { useEffect } from 'react';
import { Layout, Menu, Card } from 'antd';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';
import './profile.scss';

const { Sider, Content } = Layout;

const Profile = () => {
  const location = useLocation();

  const selectedKey = location.pathname.includes('change-password') ? 'change-password' : 'edit-profile';

  return (
    <Layout style={{ height: 'inherit', borderRadius: '10px', overflow: 'hidden' }}>
      <Sider
        style={{
          background: '#fff',
          borderRadius: '10px 0 0 10px',
          borderRight: '1px solid #d9d9d9'
        }}
      >
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]}
          style={{ height: '100%', width: 'inherit', borderRadius: '10px', border: 'none', margin: '5px' }}
        >
          <Menu.Item key="edit-profile" style={{ width: 'inherit' }}>
            <Link to="edit-profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="change-password">
            <Link to="change-password">Change Password</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Content>
        <Card style={{ width: '100%', minWidth: '20%', borderRadius: '0px 10px 10px 0px', border: 'none', margin: 0 }}>
          <Routes>
            <Route path="edit-profile" element={<EditProfile />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="*" element={<Navigate to="edit-profile" replace />} />
          </Routes>
        </Card>
      </Content>
    </Layout>
  );
};

export default Profile;
