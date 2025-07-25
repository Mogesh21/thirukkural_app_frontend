import React, { useEffect, useState } from 'react';
import { Table, notification, Input, Button } from 'antd';
import axiosInstance from 'config/axiosConfig';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const AuthorsList = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState();
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10
  });

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get('/reports');
      const data = response.data?.data || [];
      const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReports(sortedData);
      setFilteredData(sortedData);
    } catch (err) {
      notification.error({ message: 'Unable to get Reports', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    setTableLoading(false);
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(
        reports.filter(
          (report) =>
            report.device_id.toLowerCase() === search.toLowerCase() ||
            report.reason.toLowerCase().includes(search.toLowerCase()) ||
            report.video_id == search
        )
      );
    } else {
      setFilteredData(reports);
    }
  }, [search]);

  const columns = [
    {
      title: 'SNO',
      render: (_, record, index) => (
        <div style={{ width: 'max-content', textWrap: 'nowrap' }}> {(pagination.current - 1) * pagination.pageSize + index + 1}</div>
      )
    },
    {
      title: 'Video ID',
      dataIndex: 'video_id',
      key: 'video_id'
    },
    {
      title: 'Device Id',
      dataIndex: 'device_id',
      key: 'device_id'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Reported on',
      key: 'reported_on',
      render: (_, record) => <span>{dayjs(record.created_at).format('DD-MM-YYYY HH:mm')}</span>
    },
    {
      title: 'Options',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate('/app/dashboard/explanations/edit-explanation', { state: record })}
          style={{ backgroundColor: '#1DCCDE' }}
        >
          View
        </Button>
      )
    }
  ];

  return (
    <div className="page">
      <div className="search-container">
        <Input placeholder="Search here" value={search} className="search-bar" onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="container">
        <Table
          style={{ width: '100%', overflow: 'auto' }}
          columns={columns}
          onChange={(pag) => setPagination(pag)}
          loading={tableLoading}
          dataSource={filteredData}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default AuthorsList;
