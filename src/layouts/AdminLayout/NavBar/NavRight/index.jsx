import React, { useMemo, useState } from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import ChatList from './ChatList';
import { logOut } from 'store/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { notification } from 'antd';
import { jwtDecode } from 'jwt-decode';
import DefaultImage from '../../../../assets/images/default.png';

const NavRight = () => {
  const [listOpen, setListOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const user = useMemo(() => {
    try {
      return token ? jwtDecode(token).data : {};
    } catch {
      return {};
    }
  }, [token]);

  const handleLogout = async () => {
    await dispatch(logOut());
    notification.success({ message: 'Logged Out Successfully' });
    navigate('/auth/login');
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" style={{ width: '24px', height: '24px', display: 'inline-block' }} />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <img
                    src={user.avatar ? user.avatar : DefaultImage}
                    style={{ maxHeight: '3rem', aspectRatio: '1/1' }}
                    className="img-radius"
                    alt="User Profile"
                  />
                  <span>{user.name}</span>
                </div>
                <button
                  style={{ backgroundColor: 'transparent', border: 'none', margin: 0, justifyContent: 'center' }}
                  onClick={handleLogout}
                >
                  <i className="feather icon-log-out" />
                </button>
              </div>
              {/* <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-settings" /> Settings
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-user" /> Profile
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-mail" /> My Messages
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="#" className="dropdown-item">
                    <i className="feather icon-lock" /> Lock Screen
                  </Link>
                </ListGroup.Item>
              </ListGroup> */}
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
      <ChatList listOpen={listOpen} closed={() => setListOpen(false)} />
    </React.Fragment>
  );
};

export default NavRight;
