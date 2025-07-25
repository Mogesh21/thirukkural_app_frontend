import React, { useCallback, useEffect, useState } from 'react';
import { Button, notification, Card, Table, Select, Popconfirm } from 'antd';
import axiosInstance from 'config/axiosConfig';

const CreateVideos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filter, setFilter] = useState(null);
  const [tableLoading, setTableLoading] = useState(true);
  const [queueSize, setQueueSize] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    if (parseInt(filter)) {
      const filters = videos.filter((record) => record.author_id === parseInt(filter));
      setFilteredData(filters);
      const videoCount = filters.reduce((total, record) => total + record.video_count, 0);
      setTotalVideos(videoCount);
    } else {
      const videoCount = videos.reduce((total, record) => total + record.video_count, 0);
      setTotalVideos(videoCount);
      setFilteredData(videos);
    }
  }, [videos, filter]);

  const fetchVideos = useCallback(async () => {
    setTableLoading(true);
    try {
      const response = await axiosInstance.get('/kurals/videos-details');
      const data = response.data.data;
      const authorMap = new Map();
      data.forEach((item) => {
        authorMap.set(item.author_id, { id: item.author_id, name: item.author_name });
      });
      const authorData = Array.from(authorMap.values());
      setAuthors(authorData);
      setVideos(data || []);
    } catch (err) {
      notification.error({ message: 'Unable to get Details', duration: 2 });
    } finally {
      setTableLoading(false);
    }
  });

  const columns = [
    {
      title: 'Adhikaram No',
      dataIndex: 'kural_adhi_number',
      key: 'kural_adhi_number',
      sorter: (a, b) => a.kural_adhi_number - b.kural_adhi_number
    },
    {
      title: 'Author Name',
      dataIndex: 'author_name',
      key: 'author_name'
    },
    {
      title: 'Video Count',
      dataIndex: 'video_count',
      key: 'video_count',
      sorter: (a, b) => a.video_count - b.video_count
    },
    {
      title: 'Options',
      render: (text, record) => {
        {
        }
        return (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Popconfirm
              title="Create All videos"
              description="Are you sure to create all video?"
              onConfirm={() => handleCreateVideo(record)}
              placement="left"
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" style={{ backgroundColor: record.video_count === 10 ? '#ff5588' : '#f79a0f', color: 'white' }}>
                {record.video_count === 10 ? 'Create Again' : 'Create All'}
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
        adhikaram_no: video.kural_adhi_number,
        author_id: video.author_id
      });
      if (response.status === 200) {
        notification.success({ message: response.data.message });
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 503) notification.error({ message: 'Video server is offline' });
        else notification.error({ message: 'Error creating Video' });
      } else {
        notification.error({ message: 'Error creating Video' });
      }
    }
  };

  const fetchQueueSize = async () => {
    const response = await axiosInstance.get('/videos/queue-size');
    if (response.status === 200) {
      setQueueSize(response.data.size);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 10 }}>
        <Card title="Total Videos" variant="borderless" style={{ minWidth: 250, maxWidth: 400 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{totalVideos}</span>
        </Card>
        <Card title="Total Adhikaram" variant="borderless" style={{ minWidth: 250, maxWidth: 400 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>133</span>
        </Card>
        <Card title="Total Authors" variant="borderless" style={{ minWidth: 250, maxWidth: 400 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{authors.length}</span>
        </Card>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Button onClick={() => fetchQueueSize()}>Get Queue Size</Button>
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', alignContent: 'center' }}>{queueSize}</span>
        </div>
        <Select
          value={filter}
          placeholder="Select Author"
          style={{ width: '15rem' }}
          onChange={(val) => {
            console.log(val);
            setFilter(val);
          }}
        >
          {console.log(filter)}
          <Select.Option key={0} val={0}>
            {' '}
          </Select.Option>
          {authors.map((author) => (
            <Select.Option key={author.id} val={author.id}>
              {author.name}
            </Select.Option>
          ))}
        </Select>
      </div>
      <div className="container">
        <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={filteredData} rowKey="id" />
      </div>
    </div>
  );
};

export default CreateVideos;
