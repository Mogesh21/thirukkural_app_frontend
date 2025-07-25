import { Checkbox, Table } from 'antd';
import React, { useState } from 'react';

const PrivilegeTable = ({ privileges, modules, setPrivileges }) => {
  const onChange = (module, action, checked) => {
    if (action === 'all') {
      checked
        ? setPrivileges({
            ...privileges,
            [module]: module === 'Reports' ? '0100' : '1111'
          })
        : setPrivileges({
            ...privileges,
            [module]: '0000'
          });
    } else {
      let currentPrivileges = privileges[module].split('');
      const actionIndex = { create: 0, read: 1, update: 2, delete: 3 }[action];
      currentPrivileges[actionIndex] = checked ? '1' : '0';
      setPrivileges({
        ...privileges,
        [module]: currentPrivileges.join('')
      });
    }
    // console.log({
    //   ...privileges,
    //   [module]: currentPrivileges.join('')
    // });
  };

  const tableColumns = [
    {
      title: 'Module',
      key: 'module',
      render: (module) => <p>{module}</p>
    },
    {
      title: 'CREATE',
      key: 'create',
      render: (module) => {
        return module === 'Reports' ? (
          <Checkbox disabled={true} />
        ) : (
          <Checkbox checked={privileges[module][0] === '1'} onChange={(e) => onChange(module, 'create', e.target.checked)} />
        );
      }
    },
    {
      title: 'READ',
      key: 'read',
      render: (module) => <Checkbox checked={privileges[module][1] === '1'} onChange={(e) => onChange(module, 'read', e.target.checked)} />
    },
    {
      title: 'UPDATE',
      key: 'update',
      render: (module) => {
        return module === 'Reports' ? (
          <Checkbox disabled={true} />
        ) : (
          <Checkbox checked={privileges[module][2] === '1'} onChange={(e) => onChange(module, 'update', e.target.checked)} />
        );
      }
    },
    {
      title: 'DELETE',
      key: 'delete',
      render: (module) => {
        return module === 'Reports' ? (
          <Checkbox disabled={true} />
        ) : (
          <Checkbox checked={privileges[module][3] === '1'} onChange={(e) => onChange(module, 'delete', e.target.checked)} />
        );
      }
    },
    {
      title: 'Full Control',
      key: 'all',
      render: (module) => (
        <Checkbox
          checked={privileges[module] === '1111' || (module === 'Reports' && privileges[module] === '0100')}
          onChange={(e) => onChange(module, 'all', e.target.checked)}
        />
      )
    }
  ];

  const tableData = modules.map((module) => module);

  return <Table columns={tableColumns} dataSource={tableData} rowKey="module" pagination={false} />;
};

export default PrivilegeTable;
