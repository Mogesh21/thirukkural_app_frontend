import React, { useEffect, useState } from 'react';
import { Table, notification, Input, Button, Popconfirm, Modal } from 'antd';
import axiosInstance from 'config/axiosConfig';
import ReactPlayer from 'react-player';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [videos, setVideos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [view, setView] = useState(null);
  const [search, setSearch] = useState('');
  const [tableLoading, setTableLoading] = useState(true);
  const [queueSize, setQueueSize] = useState(0);
  const [searchParams] = useSearchParams();
  const searchText = searchParams.get('search');
  useEffect(() => {
    if (!isNaN(parseInt(searchText))) {
      setSearch(parseInt(searchText));
    }
  }, [searchText]);

  const fetchVideos = async () => {
    setTableLoading(true);
    try {
      const response = await axiosInstance.get('/videos');
      const data = response.data.data;
      setVideos(data || []);
    } catch (err) {
      notification.error({ message: 'Unable to get Videos', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredData(videos.filter((video) => video.kural_no === parseInt(search) || video.id === parseInt(search)));
    } else {
      setFilteredData(videos);
    }
  }, [videos, search]);

  const columns = [
    {
      title: 'Video Id',
      dataIndex: 'id',
      key: 'id',
      sorter: {
        compare: (a, b) => a.id - b.id
      }
    },
    {
      title: 'Kural No',
      dataIndex: 'kural_no',
      key: 'kural_no'
    },
    {
      title: 'Author Id',
      dataIndex: 'author_id',
      key: 'author_id'
    },
    {
      title: 'Report Count',
      dataIndex: 'report_count',
      key: 'report_count'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) =>
        record.status === 1 ? (
          <Button type="primary" onClick={() => handleStatus(record, 'inactive')} style={{ width: '4rem', backgroundColor: '#027625' }}>
            Active
          </Button>
        ) : (
          <Button danger type="primary" onClick={() => handleStatus(record, 'active')} style={{ width: '4rem' }}>
            Inactive
          </Button>
        )
    },
    {
      title: 'Options',
      render: (text, record) => {
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button type="primary" onClick={() => setView(record.url)} style={{ backgroundColor: '#1DCCDE' }}>
              View
            </Button>
            <Popconfirm
              title="Create new video"
              description="Are you sure to create alternate video?"
              onConfirm={() => handleCreateVideo(record)}
              placement="left"
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" style={{ backgroundColor: '#f79a0f', color: 'white' }}>
                Create
              </Button>
            </Popconfirm>
          </div>
        );
      }
    }
  ];

  const handleCreateVideo = async (video) => {
    try {
      const response = await axiosInstance.post('/videos', {
        kural_no: video.kural_no,
        author_id: video.author_id
      });
      if (response.status === 200) {
        setQueueSize(response.data.size);
        notification.success({ message: response.data.message });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 503) notification.error({ message: 'Video server is offline' });
        if (err.response.status === 422) notification.error({ message: err.response.data.message });
        else notification.error({ message: 'Error creating Video' });
      } else {
        notification.error({ message: 'Error creating Video' });
      }
    }
  };

  const handleStatus = async (record, status) => {
    if (status === 'active') record.status = 1;
    else record.status = 0;
    try {
      await axiosInstance.patch('/videos', record);
      fetchVideos();
    } catch (err) {
      notification.error({ message: 'Unable to change status', duration: 2 });
    }
  };

  const fetchQueueSize = async () => {
    const response = await axiosInstance.get('/videos/queue-size');
    if (response.status === 200) {
      setQueueSize(response.data.size);
    }
  };

  return (
    <div className="page">
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button onClick={() => fetchQueueSize()}>Get Queue Size</Button>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', alignContent: 'center' }}>{queueSize}</span>
        </div>
        <Input
          placeholder="Search Kural No or Video Id"
          value={search}
          className="search-bar"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>

      <Modal open={view ? true : false} destroyOnClose={true} onCancel={() => setView(null)} footer={null}>
        <ReactPlayer
          src={view}
          playing={true}
          controls={true}
          loop={false}
          muted={false}
          volume={0.8}
          playbackRate={1.0}
          style={{ height: '20rem', width: '100%', aspectRatio: '16/9', marginTop: '1.5rem' }}
        />
      </Modal>
    </div>
  );
};

export default Index;
