import { Button, Card, notification, Table } from 'antd';
import axiosInstance from 'config/axiosConfig';
import dayjs from 'dayjs';
import LineChart from 'components/charts/LineChart';
import React, { useEffect, useRef, useState } from 'react';
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

const index = () => {
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

  const rawData = Array.from({ length: 30 }, (_, i) => {
    return {
      x: dayjs()
        .subtract(30 - i, 'day')
        .toISOString(),
      y: Math.floor(Math.random() * 100) + 1
    };
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
          onClick={() => navigate('/app/dashboard/explanations/edit-explanation', { state: record })}
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

  const getSmartGrouping = (start, end) => {
    const hours = end.diff(start, 'hour');
    const days = end.diff(start, 'day');

    if (hours <= 48 && hours <= 15) return 'hourly';
    if (days <= 60 && days <= 15) return 'daily';
    return 'weekly';
  };

  // const formatReports = (rangeStart = null, rangeEnd = null) => {
  //   if (filteredReports && filteredReports.length > 0) {
  //     const sortedDates = filteredReports.map((r) => dayjs(r.created_at)).sort((a, b) => a.valueOf() - b.valueOf());

  //     const defaultStart = sortedDates[0];
  //     const defaultEnd = sortedDates[sortedDates.length - 1];

  //     const start = rangeStart ? dayjs(rangeStart) : defaultStart;
  //     const end = rangeEnd ? dayjs(rangeEnd) : defaultEnd;

  //     const formatKey = getGroupingFormat(start, end);

  //     // const grouped = filteredReports.reduce((acc, item) => {
  //     //   const time = dayjs(item.created_at);
  //     //   const key = time.format(formatKey);
  //     //   acc[key] = (acc[key] || 0) + 1;
  //     //   return acc;
  //     // }, {});

  //     const grouped = filteredReports.reduce((acc, item) => {
  //       const time = dayjs(item.created_at);

  //       let key;

  //       if (formatKey === '[W]WW YYYY') {
  //         const startOfWeek = time.startOf('week');
  //         const endOfWeek = time.endOf('week');
  //         key = `${startOfWeek.format('MMM D')}–${endOfWeek.format('D')}`;
  //       } else {
  //         key = time.format(formatKey);
  //       }

  //       acc[key] = (acc[key] || 0) + 1;
  //       return acc;
  //     }, {});

  //     const labels = Object.keys(grouped).sort();

  //     const data = labels.map((label) => ({ x: label, y: grouped[label] }));

  //     const chartData = {
  //       series: [{ name: 'Reports', data }],
  //       options: {
  //         chart: {
  //           type: 'area',
  //           zoom: {
  //             enabled: true,
  //             type: 'x',
  //             autoScaleYaxis: true
  //           },
  //           toolbar: {
  //             tools: { pan: true, zoom: true, reset: true },
  //             autoSelected: 'zoom'
  //           },
  //           pan: {
  //             enabled: true,
  //             type: 'x',
  //             cursor: 'grab'
  //           },
  //           events: {
  //             zoomed: function (chartContext, { xaxis }) {
  //               formatReports(xaxis.min, xaxis.max);
  //             },
  //             scrolled: function (chartContext, { xaxis }) {
  //               formatReports(xaxis.min, xaxis.max);
  //             }
  //           }
  //         },
  //         xaxis: {
  //           type: 'datetime',
  //           labels: {
  //             rotate: -45,
  //             datetimeFormatter: {
  //               hour: 'HH:mm',
  //               day: 'MMM dd',
  //               month: 'MMM yyyy',
  //               year: 'yyyy'
  //             }
  //           },
  //           title: { text: 'Time' }
  //         },
  //         yaxis: {
  //           title: { text: 'Report Count' },
  //           labels: { formatter: (val) => val.toFixed(0) }
  //         },
  //         tooltip: {
  //           x: {
  //             format:
  //               formatKey === 'YYYY-MM-DD HH:00'
  //                 ? 'yyyy-MM-dd HH:00'
  //                 : formatKey === 'YYYY-MM-DD'
  //                   ? 'yyyy-MM-dd'
  //                   : formatKey === '[W]WW YYYY'
  //                     ? "'Week' WW yyyy"
  //                     : 'yyyy-MM'
  //           },
  //           y: {
  //             formatter: (val) => val.toFixed(0)
  //           }
  //         }
  //       }
  //     };

  //     setReportData(chartData);
  //   }
  // };

  const formatReports = (rangeStart = null, rangeEnd = null) => {
    if (!filteredReports || filteredReports.length === 0) return;

    const sortedDates = filteredReports.map((r) => dayjs(r.created_at)).sort((a, b) => a - b);

    const defaultStart = sortedDates[0];
    const defaultEnd = sortedDates[sortedDates.length - 1];

    const start = rangeStart ? dayjs(rangeStart) : defaultStart;
    const end = rangeEnd ? dayjs(rangeEnd) : defaultEnd;

    // Filter records inside current range
    const visibleReports = filteredReports.filter((r) => dayjs(r.created_at).isBetween(start, end, null, '[]'));

    const visibleCount = visibleReports.length;

    // 🧠 Determine grouping
    let formatKey = 'YYYY-MM-DD'; // default daily
    let tooltipFormat = 'yyyy-MM-dd';

    if (visibleCount > 15) {
      formatKey = '[W]WW YYYY';
      tooltipFormat = "'Week' WW yyyy";
      labelFormat = 'MMM D';
    } else if (visibleCount <= 15 && dayjs(end).diff(start, 'day') <= 3) {
      formatKey = 'YYYY-MM-DD HH:00';
      tooltipFormat = 'yyyy-MM-dd HH:00';
      labelFormat = 'HH:mm';
    }

    // 🔁 Grouping
    const grouped = visibleReports.reduce((acc, item) => {
      const time = dayjs(item.created_at);
      const key = time.format(formatKey);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(grouped).sort();
    const data = labels.map((label) => ({ x: label, y: grouped[label] }));

    const chartData = {
      series: [{ name: 'Reports', data }],
      options: {
        chart: {
          type: 'area',
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
          type: 'category', // Use category to show custom string label like "Week 23 2025"
          title: { text: 'Time' },
          labels: {
            rotate: -45,
            formatter: (val) => val // 👈 will now show "Week 25 2025" or "2024-05-01"
          }
        },
        yaxis: {
          title: { text: 'Report Count' },
          labels: { formatter: (val) => val.toFixed(0) }
        },
        tooltip: {
          x: {
            format: tooltipFormat
          },
          y: {
            formatter: (val) => val.toFixed(0)
          }
        }
      }
    };

    setReportData(chartData);
  };

  const getGroupingFormat = (start, end) => {
    const rangeInMs = dayjs(end).diff(dayjs(start));

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    if (rangeInMs <= oneDay) return 'YYYY-MM-DD HH:00'; // hourly
    if (rangeInMs <= oneWeek) return 'YYYY-MM-DD'; // daily
    if (rangeInMs <= oneMonth) return '[W]WW YYYY'; // weekly
    return 'YYYY-MM'; // monthly
  };

  // const formatReports = () => {
  //   if (filteredReports && filteredReports.length > 0) {
  //     const shouldGroupByDay = filteredReports.length > 10;

  //     const grouped = filteredReports.reduce((acc, item) => {
  //       const key = dayjs(item.created_at).format(shouldGroupByDay ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:00');
  //       acc[key] = (acc[key] || 0) + 1;
  //       return acc;
  //     }, {});

  //     const labels = Object.keys(grouped).sort();

  //     const data = labels.map((label) => ({
  //       x: label,
  //       y: grouped[label]
  //     }));

  //     const chartData = {
  //       series: [{ name: 'Reports', data }],
  //       options: {
  //         chart: {
  //           type: 'area',
  //           zoom: { enabled: true, type: 'x', autoScaleYaxis: true },
  //           toolbar: {
  //             tools: { pan: true, zoom: true, reset: true },
  //             autoSelected: 'zoom'
  //           },
  //           pan: { enabled: true, type: 'x', cursor: 'grab' }
  //         },
  //         xaxis: {
  //           type: 'datetime',
  //           labels: {
  //             rotate: -45,
  //             datetimeFormatter: {
  //               hour: 'HH:mm',
  //               day: 'MMM dd',
  //               month: 'MMM yyyy',
  //               year: 'yyyy'
  //             }
  //           },
  //           title: { text: 'Time' },
  //           tickAmount: shouldGroupByDay ? 10 : undefined
  //         },
  //         yaxis: {
  //           title: { text: 'Report Count' },
  //           labels: { formatter: (val) => val.toFixed(0) }
  //         },
  //         tooltip: {
  //           x: {
  //             format: shouldGroupByDay ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm'
  //           },
  //           y: {
  //             formatter: (val) => val.toFixed(0)
  //           }
  //         }
  //       }
  //     };

  //     setReportData(chartData);
  //   }
  // };

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
    // return Array.from(map.values());
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
      <div className="graph-container">{reportData && reportData.series && <LineChart rawData={rawData} />}</div>
      <Table style={{ width: '100%', overflow: 'auto' }} columns={columns} loading={tableLoading} dataSource={kuralReports} rowKey="id" />
    </div>
  );
};

export default index;
