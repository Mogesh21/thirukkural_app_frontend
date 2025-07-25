// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const index = ({ data, ref, title = '' }) => {
//   const options = {
//     ...data?.options,
//     title: {
//       ...data?.options?.title,
//       text: title
//     }
//   };

//   return (
//     <ReactApexChart
//       // key={options.chart.events ? 'with-events' : 'no-events'}
//       ref={ref}
//       options={options}
//       series={data}
//       type="area"
//       height={350}
//     />
//   );
// };

// export default index;

import React, { useEffect, useState, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const index = ({ rawData }) => {
  const chartRef = useRef(null);
  const [series, setSeries] = useState([]);
  const [granularity, setGranularity] = useState('week');

  // Grouping function
  const groupData = (data, granularity) => {
    const grouped = {};
    data.forEach(({ x, y }) => {
      const date = dayjs(x);
      let key;
      if (granularity === 'week') key = date.startOf('week').format();
      else if (granularity === 'day') key = date.startOf('day').format();
      else if (granularity === 'hour') key = date.startOf('hour').format();

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(y);
    });

    return Object.entries(grouped).map(([x, yVals]) => ({
      x: dayjs(x).valueOf(),
      y: yVals.reduce((a, b) => a + b, 0) // Sum of y
    }));
  };

  const handleZoomChange = (from, to) => {
    const visibleData = rawData.filter((item) => {
      const timestamp = dayjs(item.x).valueOf();
      return timestamp >= from && timestamp <= to;
    });

    let newGranularity = 'week';
    if (visibleData.length < 15) newGranularity = 'day';
    if (visibleData.length < 7) newGranularity = 'hour';

    if (newGranularity !== granularity) {
      const grouped = groupData(rawData, newGranularity);
      setSeries([{ name: 'My Data', data: grouped }]);
      setGranularity(newGranularity);
    }
  };

  const chartOptions = {
    chart: {
      id: 'zoom-chart',
      type: 'area',
      zoom: {
        enabled: true,
        type: 'x',
        autoScaleYaxis: true
      },
      events: {
        zoomed: function (_, { xaxis }) {
          handleZoomChange(xaxis.min, xaxis.max);
        },
        beforeResetZoom: function () {
          const grouped = groupData(rawData, 'week');
          setSeries([{ name: 'My Data', data: grouped }]);
          setGranularity('week');
        }
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: (value) => {
          const d = dayjs(value);
          if (granularity === 'week') return `W${d.isoWeek()}`;
          if (granularity === 'day') return d.format('MMM D');
          if (granularity === 'hour') return d.format('HH:mm');
          return d.format('MMM D');
        }
      }
    },
    tooltip: {
      x: {
        formatter: (value) => {
          const d = dayjs(value);
          if (granularity === 'week') return `Week ${d.isoWeek()}`;
          if (granularity === 'day') return d.format('MMMM D, YYYY');
          if (granularity === 'hour') return d.format('HH:mm A, MMM D');
          return d.format();
        }
      }
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      curve: 'smooth'
    }
  };

  useEffect(() => {
    const initialGranularity = rawData.length > 15 ? 'week' : 'day';
    const grouped = groupData(rawData, initialGranularity);
    setSeries([{ name: 'My Data', data: grouped }]);
    setGranularity(initialGranularity);
  }, [rawData]);

  return (
    <div>
      <ReactApexChart ref={chartRef} options={chartOptions} series={series} type="area" height={350} />
    </div>
  );
};

export default index;
