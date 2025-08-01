import { Button, Card, notification, Table } from 'antd';
import axiosInstance from 'config/axiosConfig';
import dayjs from 'dayjs';
import LineChart from 'components/charts/LineChart';
import React, { useEffect, useState } from 'react';
import DateSelector from 'components/DateSelector';
import { useNavigate } from 'react-router-dom';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(advancedFormat);
dayjs.extend(isBetween);

const Index = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [kuralReports, setKuralReports] = useState([]);
  const [reportData, setReportData] = useState({});
  const [tableLoading, setTableLoading] = useState(true);
  const [date, setDate] = useState({
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month')
  });

  const columns = [
    {
      title: 'Video ID',
      dataIndex: 'video_id',
      key: 'video_id'
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason'
    },
    {
      title: 'Report count',
      dataIndex: 'report_count',
      key: 'report_count'
    },
    {
      title: 'Options',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => navigate(`/app/dashboard/videos/videos-list?search=${record.video_id}`)}
          style={{ backgroundColor: '#1DCCDE' }}
        >
          View
        </Button>
      )
    }
  ];

  const fetchReports = async () => {
    try {
      const response = await axiosInstance.get('/reports');
      setReports(response.data.data || []);
      setTableLoading(false);
    } catch (err) {
      notification.error({ message: 'Please reload the page' });
    }
  };

  const formatReports = (rangeStart = null, rangeEnd = null) => {
    if (!filteredReports || filteredReports.length === 0) return;

    // Convert inputs to dayjs instances if present
    const allDates = filteredReports.map((r) => dayjs(r.created_at)).sort((a, b) => a - b);

    const defaultStart = allDates[0];
    const defaultEnd = allDates[allDates.length - 1];

    const start = rangeStart ? dayjs(Number(rangeStart)) : defaultStart;
    const end = rangeEnd ? dayjs(Number(rangeEnd)) : defaultEnd;

    // Filter only reports within selected time range
    const visibleReports = filteredReports.filter((r) => dayjs(r.created_at).isBetween(start, end, null, '[]'));

    // Format data: each report is a separate point with y=1
    const data = visibleReports.map((r) => ({
      x: dayjs(r.created_at).format('YYYY-MM-DD'),
      y: 1
    }));

    const chartData = {
      series: [{ name: 'Reports', data }],
      options: {
        chart: {
          type: 'scatter',
          zoom: {
            enabled: true,
            type: 'x',
            autoScaleYaxis: true
          },
          toolbar: {
            tools: { pan: true, zoom: true, reset: true },
            autoSelected: 'zoom'
          },
          pan: {
            enabled: true,
            type: 'x',
            cursor: 'grab'
          },
          events: {
            zoomed: (chartContext, { xaxis }) => {
              formatReports(xaxis.min, xaxis.max);
            },
            scrolled: (chartContext, { xaxis }) => {
              formatReports(xaxis.min, xaxis.max);
            }
          }
        },
        xaxis: {
          type: 'category',
          title: { text: 'Date' },
          labels: {
            rotate: -45
          }
        },
        yaxis: {
          title: { text: 'Report Count' },
          labels: {
            formatter: (val) => val.toFixed(0)
          }
        },
        tooltip: {
          x: { format: 'yyyy-MM-dd' },
          y: { formatter: (val) => val.toFixed(0) }
        }
      }
    };

    setReportData(chartData);
  };

  const formatKuralReports = () => {
    const map = new Map();
    filteredReports.forEach((report) => {
      const { video_id, reason_id, reason, device_id } = report;
      const key = `${video_id}_${reason_id}`;

      if (!map.has(key)) {
        map.set(key, {
          video_id,
          reason_id,
          reason,
          report_count: 1,
          device_ids: [device_id]
        });
      } else {
        const entry = map.get(key);
        entry.report_count += 1;

        if (!entry.device_ids.includes(device_id)) {
          entry.device_ids.push(device_id);
        }
      }
    });
    setKuralReports(Array.from(map.values()).sort((a, b) => b.report_count - a.report_count));
  };

  const uniqueReportUserCount = () => {
    const user = [];
    const count = filteredReports.reduce((total, current) => {
      if (!user.includes(current.device_id)) {
        user.push(current.device_id);
        return total + 1;
      }
      return total;
    }, 0);

    return count;
  };

  const getMostCommon = (array, key) => {
    const countMap = {};

    array.forEach((item) => {
      const value = item[key];
      countMap[value] = (countMap[value] || 0) + 1;
    });

    let maxKey = null;
    let maxCount = 0;

    for (const [key, count] of Object.entries(countMap)) {
      if (count > maxCount) {
        maxCount = count;
        maxKey = key;
      }
    }

    return maxKey || '-';
  };

  useEffect(() => {
    fetchReports();
    setTableLoading(false);
  }, []);

  useEffect(() => {
    const filteredReport = reports.filter((report) => {
      const start = dayjs(date.start).valueOf();
      const end = dayjs(date.end).valueOf();
      const current = dayjs(report.created_at).valueOf();
      if (current >= start && current <= end) return true;
      return false;
    });
    setFilteredReports(filteredReport);
  }, [reports, date]);

  useEffect(() => {
    formatReports();
    if (filteredReports.length > 0) formatKuralReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredReports]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="filter-header">
        <p style={{ margin: 0, textAlign: 'center', alignContent: 'center' }}>Currently viewing</p>
        <DateSelector date={date} setDate={setDate} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 10 }}>
        <Card title="Report Count" variant="borderless" style={{ minWidth: 250 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{filteredReports.length}</span>
        </Card>
        <Card title="Report User Count" variant="borderless" style={{ minWidth: 250 }}>
          <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{uniqueReportUserCount()}</span>
        </Card>
        <Card title="Most Reported" variant="borderless" style={{ minWidth: 250, display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontWeight: 'normal', fontSize: '1.2rem', margin: '0' }}>
            Kural : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{getMostCommon(filteredReports, 'video_id')}</span>
          </p>
          <span style={{ fontWeight: 'normal', fontSize: '1.2rem' }}>
            Reason : <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{getMostCommon(filteredReports, 'reason')}</span>
          </span>
        </Card>
      </div>
      <div className="graph-container">
        {reportData && reportData.series && reportData.series.length > 0 && <LineChart rawData={reportData.series[0].data || []} />}
      </div>
      <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={kuralReports} rowKey="id" />
    </div>
  );
};

export default Index;
