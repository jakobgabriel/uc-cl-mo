import React, { useState, useEffect } from 'react';
import { Gauge, ClipboardList, Zap, Activity, Package, Monitor, BarChart3, Thermometer, Factory, ChevronLeft, ChevronRight, Moon, Sun, RefreshCw, Download } from 'lucide-react';

// ============================================
// CURING OVEN DATA GENERATION
// ============================================

const generateCuringTempData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const hour = 10 + Math.floor(i * 24 / 100);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    const minutes = Math.floor(((i * 24 / 100) % 1) * 60);
    const timeLabel = `${String(adjustedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    let actual, setpoint = 228;
    if (i < 25) {
      actual = 226 + Math.random() * 4;
    } else if (i < 45) {
      actual = 225 + Math.random() * 6;
    } else if (i < 55) {
      const progress = (i - 45) / 10;
      actual = 228 - progress * 195 + Math.random() * 5;
      setpoint = 228 - progress * 195;
    } else if (i < 75) {
      actual = 32 + Math.random() * 3;
      setpoint = 32;
    } else {
      const progress = (i - 75) / 25;
      actual = 32 + progress * 196 + Math.random() * 5;
      setpoint = 32 + progress * 196;
    }

    const minVal = actual - 8 - Math.random() * 2;
    const maxVal = actual + 9 + Math.random() * 2;
    data.push({
      time: timeLabel,
      actual: Math.max(20, Math.min(250, actual)),
      setpoint: Math.max(20, Math.min(250, setpoint)),
      min: Math.max(20, Math.min(250, minVal)),
      max: Math.max(20, Math.min(250, maxVal)),
      index: i
    });
  }
  return data;
};

const generateCuringConveyorData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const hour = 10 + Math.floor(i * 24 / 100);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    const minutes = Math.floor(((i * 24 / 100) % 1) * 60);
    const timeLabel = `${String(adjustedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    let actual = (i >= 55 && i < 75) ? 0 : 0.0999 + (Math.random() - 0.5) * 0.002;
    data.push({
      time: timeLabel,
      actual: Math.max(0, actual),
      setpoint: 0.1,
      status: (i >= 55 && i < 75) ? 'Stopped' : 'Running',
      index: i
    });
  }
  return data;
};

// ============================================
// CURING OVEN DASHBOARD
// ============================================

const CuringOvenDashboard = ({ darkMode }) => {
  const [tempData] = useState(generateCuringTempData());
  const [conveyorData] = useState(generateCuringConveyorData());

  const [currentTemp, setCurrentTemp] = useState({
    setpoint: 228, actual: 227, min: 218, max: 238
  });
  const [conveyorSpeed, setConveyorSpeed] = useState({
    setpoint: 0.100, actual: 0.0999
  });
  const [upheatingPeriod, setUpheatingPeriod] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setUpheatingPeriod(prev => prev + 1);
      setCurrentTemp(prev => ({
        ...prev,
        actual: 227 + (Math.random() - 0.5) * 2
      }));
      setConveyorSpeed(prev => ({
        ...prev,
        actual: 0.0999 + (Math.random() - 0.5) * 0.001
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Chart helpers
  const chartW = 560, padL = 55, padR = 10, padT = 10, padB = 25;
  const plotW = chartW - padL - padR;
  const timeLabels = ['10:00','12:00','14:00','16:00','18:00','20:00','22:00','00:00','02:00','04:00','06:00','08:00'];

  const TempChart = () => {
    const chartH = 170, plotH = chartH - padT - padB;
    const yMin = 0, yMax = 250;
    const toX = (i) => padL + (i / (tempData.length - 1)) * plotW;
    const toY = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    return (
      <div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center mb-1">Temperature time series</p>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          <rect x={padL} y={padT} width={plotW} height={plotH} fill={darkMode ? '#111827' : '#f8fafc'} />
          {[0, 50, 100, 150, 200, 250].map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={padL + plotW} y2={toY(v)} stroke={darkMode ? '#374151' : '#e2e8f0'} strokeWidth="0.5" />
              <text x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{v} °C</text>
            </g>
          ))}
          {timeLabels.map((t, i) => (
            <text key={i} x={padL + (i / (timeLabels.length - 1)) * plotW} y={chartH - 4} textAnchor="middle" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{t}</text>
          ))}
          {/* Upper/Lower limit lines */}
          <line x1={padL} y1={toY(238)} x2={padL + plotW} y2={toY(238)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
          <line x1={padL} y1={toY(218)} x2={padL + plotW} y2={toY(218)} stroke="#ef4444" strokeWidth="1" strokeDasharray="4,2" />
          {/* Setpoint line */}
          <line x1={padL} y1={toY(228)} x2={padL + plotW} y2={toY(228)} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3" />
          {/* Actual temperature */}
          <polyline
            points={tempData.map((d, i) => `${toX(i).toFixed(1)},${toY(d.actual).toFixed(1)}`).join(' ')}
            fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
        <div className="flex justify-center gap-4 mt-1">
          {[{label:'Min',color:'#ef4444'},{label:'Actual Zone 1',color:'#22c55e'},{label:'Max',color:'#ef4444'},{label:'Setpoint',color:'#f59e0b'}].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span className="w-3 h-0.5 inline-block" style={{backgroundColor:l.color}} />
              <span className="text-[9px] text-gray-500 dark:text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ConveyorChart = () => {
    const chartH = 100, plotH = chartH - padT - padB;
    const yMin = 0, yMax = 0.12;
    const toX = (i) => padL + (i / (conveyorData.length - 1)) * plotW;
    const toY = (v) => padT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;
    return (
      <div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 text-center mb-1">Conveyor speed time series</p>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          <rect x={padL} y={padT} width={plotW} height={plotH} fill={darkMode ? '#111827' : '#f8fafc'} />
          {[0, 0.05, 0.1].map(v => (
            <g key={v}>
              <line x1={padL} y1={toY(v)} x2={padL + plotW} y2={toY(v)} stroke={darkMode ? '#374151' : '#e2e8f0'} strokeWidth="0.5" />
              <text x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize="6" fill={darkMode ? '#9ca3af' : '#64748b'}>{v.toFixed(4)} m/min</text>
            </g>
          ))}
          {timeLabels.map((t, i) => (
            <text key={i} x={padL + (i / (timeLabels.length - 1)) * plotW} y={chartH - 4} textAnchor="middle" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{t}</text>
          ))}
          <line x1={padL} y1={toY(0.1)} x2={padL + plotW} y2={toY(0.1)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,2" />
          <polyline
            points={conveyorData.map((d, i) => `${toX(i).toFixed(1)},${toY(d.actual).toFixed(1)}`).join(' ')}
            fill="none" stroke="#22c55e" strokeWidth="1.5" />
        </svg>
        <div className="flex justify-center gap-4 mt-1">
          {[{label:'Speed actual',color:'#22c55e'},{label:'Speed setpoint',color:'#f59e0b'}].map(l => (
            <div key={l.label} className="flex items-center gap-1">
              <span className="w-3 h-0.5 inline-block" style={{backgroundColor:l.color}} />
              <span className="text-[9px] text-gray-500 dark:text-gray-400">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const ConveyorStatusBar = () => {
    const chartH = 70, barY = 20, barH = 25;
    const toX = (i) => padL + (i / (conveyorData.length - 1)) * plotW;

    const segments = [];
    let segStart = 0, segStatus = conveyorData[0].status;
    for (let i = 1; i < conveyorData.length; i++) {
      if (conveyorData[i].status !== segStatus) {
        segments.push({ start: segStart, end: i - 1, status: segStatus });
        segStart = i;
        segStatus = conveyorData[i].status;
      }
    }
    segments.push({ start: segStart, end: conveyorData.length - 1, status: segStatus });

    return (
      <div>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          <text x={padL - 4} y={barY + barH / 2 + 3} textAnchor="end" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>Conveyer</text>
          {segments.map((seg, i) => {
            const x1 = toX(seg.start);
            const x2 = toX(seg.end);
            return (
              <g key={i}>
                <rect x={x1} y={barY} width={x2 - x1} height={barH} fill={seg.status === 'Running' ? '#22c55e' : '#ef4444'} rx="2" />
                {(x2 - x1) > 40 && (
                  <text x={(x1 + x2) / 2} y={barY + barH / 2 + 3} textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">{seg.status}</text>
                )}
              </g>
            );
          })}
          {timeLabels.map((t, i) => (
            <text key={i} x={padL + (i / (timeLabels.length - 1)) * plotW} y={chartH - 2} textAnchor="middle" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{t}</text>
          ))}
          {/* Legend */}
          <rect x={chartW - 100} y={2} width={8} height={8} fill="#22c55e" rx="1" />
          <text x={chartW - 88} y={9} fontSize="7" fill={darkMode ? '#d1d5db' : '#475569'}>Running</text>
          <rect x={chartW - 50} y={2} width={8} height={8} fill="#ef4444" rx="1" />
          <text x={chartW - 38} y={9} fontSize="7" fill={darkMode ? '#d1d5db' : '#475569'}>Stopped</text>
        </svg>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Curing Oven SO-16 | Pass 2
        </h1>
        <span className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold text-xl">
          Running
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left column: KPI cards */}
        <div className="space-y-3">
          {/* Program Name */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase text-center">Actual Program Name</div>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 text-center mt-1">SO-16-Convolute</div>
          </div>

          {/* Temperature card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Temperature</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Setpoint</div>
                <div className="text-3xl font-bold text-amber-500">{currentTemp.setpoint} <span className="text-lg font-normal">°C</span></div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Actual</div>
                <div className="text-3xl font-bold text-green-500">{Math.round(currentTemp.actual)} <span className="text-lg font-normal">°C</span></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Minimum</div>
                <div className="text-3xl font-bold text-blue-500">{currentTemp.min} <span className="text-lg font-normal">°C</span></div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Maximum</div>
                <div className="text-3xl font-bold text-red-500">{currentTemp.max} <span className="text-lg font-normal">°C</span></div>
              </div>
            </div>
          </div>

          {/* Conveyor Speed */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Conveyor speed</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Conveyor speed setpoint</div>
                <div className="text-2xl font-bold text-amber-500">{conveyorSpeed.setpoint.toFixed(3)} <span className="text-sm font-normal">m/min</span></div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Conveyor speed actual</div>
                <div className="text-2xl font-bold text-green-500">{conveyorSpeed.actual.toFixed(4)} <span className="text-sm font-normal">m/min</span></div>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Temperature Start Timestamp</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Temperature Achieved Timestamp</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">2026-02-06<br/>04:22:57</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400">Upheating period</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1 font-mono">{formatTime(upheatingPeriod)}</div>
              </div>
            </div>
          </div>

          {/* Bottom setpoint / starting temp */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Temperature setpoint</div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mt-1">228 <span className="text-xl font-normal">°C</span></div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Starting temperature</div>
              <div className="text-4xl font-bold text-amber-500 mt-1">32 <span className="text-xl font-normal">°C</span></div>
            </div>
          </div>
        </div>

        {/* Right column: Charts */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3">
            <TempChart />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3">
            <ConveyorChart />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3">
            <ConveyorStatusBar />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PRODUCTION TRACKING DASHBOARD
// ============================================

const ProductionTrackingDashboard = ({ darkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const productionData = [
    { timeStart: '06:00', timeEnd: '07:00', article: 'ART-7004-08', target: 97, actual: 80 },
    { timeStart: '07:00', timeEnd: '08:00', article: 'ART-7004-08', target: 106, actual: 108 },
    { timeStart: '08:00', timeEnd: '09:00', article: 'ART-7004-08', target: 71, actual: 68 },
    { timeStart: '09:00', timeEnd: '10:00', article: 'ART-7004-08', target: 106, actual: 94 },
    { timeStart: '10:00', timeEnd: '11:00', article: 'ART-7004-08', target: 106, actual: 15 },
    { timeStart: '11:00', timeEnd: '12:00', article: '—', target: 0, actual: 0 },
    { timeStart: '12:00', timeEnd: '13:00', article: '—', target: 0, actual: 0 },
    { timeStart: '13:00', timeEnd: '14:00', article: '—', target: 0, actual: 0 }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const getColor = (actual, target) => {
    if (!target) return 'text-gray-500';
    const pct = (actual / target) * 100;
    return pct >= 100 ? 'text-green-600 dark:text-green-400' : 
           pct >= 90 ? 'text-amber-600 dark:text-amber-400' : 
           'text-red-600 dark:text-red-400';
  };

  const totalTarget = productionData.reduce((sum, row) => sum + row.target, 0);
  const totalActual = productionData.reduce((sum, row) => sum + row.actual, 0);
  const performance = totalTarget > 0 ? ((totalActual / totalTarget) * 100).toFixed(1) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">PRODUCTION CELL A</h1>
          <div className="text-right">
            <div className="text-sm text-blue-100 font-medium">Actual Time</div>
            <div className="text-2xl font-bold text-white font-mono">
              {formatDateTime(currentTime).split(' ')[0]}
            </div>
            <div className="text-3xl font-bold text-white font-mono">
              {formatDateTime(currentTime).split(' ')[1]}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Target Production</div>
          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalTarget}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Actual Production</div>
          <div className={`text-4xl font-bold ${getColor(totalActual, totalTarget)}`}>{totalActual}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Performance</div>
          <div className={`text-4xl font-bold ${getColor(totalActual, totalTarget)}`}>{performance}%</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Hourly Production Log</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm">
              <Download className="w-4 h-4" />Full CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              <Download className="w-4 h-4" />Shift CSV
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Time Start</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Time End</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Article #</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Target</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Actual</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-900 dark:text-white">Comment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {productionData.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 text-gray-900 dark:text-white">2026-02-06</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-mono">{row.timeStart}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-mono">{row.timeEnd}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-mono">{row.article}</td>
                  <td className="px-6 py-4 text-gray-900 dark:text-white font-bold">{row.target || '—'}</td>
                  <td className={`px-6 py-4 font-bold text-lg ${getColor(row.actual, row.target)}`}>{row.actual}</td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">—</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 dark:bg-gray-700 border-t-2">
              <tr>
                <td colSpan="4" className="px-6 py-4 text-right text-lg font-bold text-gray-900 dark:text-white">TOTAL:</td>
                <td className="px-6 py-4 text-lg font-bold text-gray-900 dark:text-white">{totalTarget}</td>
                <td className={`px-6 py-4 text-xl font-bold ${getColor(totalActual, totalTarget)}`}>{totalActual}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================
// ANDON BOARD DASHBOARD
// ============================================

const andonMachineData = [
  { workplace: 'WP-1001', machine: 'BND-A01', feederStatus: 'Running', benderStatus: 'Running', shift1: 420, shift2: 310, shift3: 0, lastPart: '2026-02-04 18:01:41', benderDowntime: 3.1, downtimeUnit: 'hour' },
  { workplace: 'WP-1002', machine: 'BND-A02', feederStatus: 'Stopped', benderStatus: 'Stopped', shift1: 0, shift2: 0, shift3: 0, lastPart: null, benderDowntime: 12.0, downtimeUnit: 'hour' },
  { workplace: 'WP-1003', machine: 'BND-B01', feederStatus: 'Running', benderStatus: 'Running', shift1: 790, shift2: 385, shift3: 0, lastPart: '2026-02-04 18:01:48', benderDowntime: 2.1, downtimeUnit: 'hour' },
  { workplace: 'WP-1004', machine: 'BND-B02', feederStatus: 'Stopped', benderStatus: 'Stopped', shift1: 1070, shift2: 0, shift3: 0, lastPart: '2026-02-04 13:38:54', benderDowntime: 4.4, downtimeUnit: 'hour' },
  { workplace: 'WP-1005', machine: 'BND-C01', feederStatus: 'Stopped', benderStatus: 'Stopped', shift1: 0, shift2: 0, shift3: 0, lastPart: null, benderDowntime: 12.0, downtimeUnit: 'hour' },
  { workplace: 'WP-1006', machine: 'BND-C02', feederStatus: 'Running', benderStatus: 'Running', shift1: 800, shift2: 420, shift3: 0, lastPart: '2026-02-04 18:01:43', benderDowntime: 33.8, downtimeUnit: 'min' },
];

const AndonBoardDashboard = ({ darkMode }) => {
  const [machines, setMachines] = useState(andonMachineData);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setMachines(prev => prev.map(m => {
        if (m.feederStatus === 'Running') {
          return {
            ...m,
            shift2: m.shift2 + Math.floor(Math.random() * 2),
            benderDowntime: Math.max(0, m.benderDowntime + (Math.random() - 0.5) * 0.01),
          };
        }
        return m;
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const StatusBadge = ({ status }) => (
    <span className={`inline-block px-6 py-2 rounded text-white font-bold text-lg ${
      status === 'Running' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      {status}
    </span>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Andon Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Bending Line Overview - Real-time Machine Status
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Last Updated</div>
          <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">{formatDateTime(currentTime)}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Workplace</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Feeder Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Bender Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Shift 1</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Shift 2</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Shift 3</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Last Part Produced</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Bender Downtime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {machines.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-lg font-mono">{m.workplace}</td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-lg font-mono">{m.machine}</td>
                  <td className="px-6 py-5 text-center"><StatusBadge status={m.feederStatus} /></td>
                  <td className="px-6 py-5 text-center"><StatusBadge status={m.benderStatus} /></td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-2xl font-bold">{m.shift1}</td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-2xl font-bold">{m.shift2}</td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-2xl font-bold">{m.shift3}</td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white text-lg font-mono">{m.lastPart || '–'}</td>
                  <td className="px-6 py-5 text-center text-gray-900 dark:text-white">
                    <span className="text-3xl font-bold">{m.benderDowntime.toFixed(1)}</span>
                    <span className="text-lg ml-1 text-gray-500 dark:text-gray-400">{m.downtimeUnit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MACHINE CARD VIEW DASHBOARD
// ============================================

const machineCardData = [
  { id: 'MLD-101', name: 'Molder 101', workplaceId: 'WP-10001', status: 'Automatic', partnumber: 'PN-220750', material: 'MAT-4590', cycleTime: '8.7 min', amountShift: '6 pcs', prevShift: '216 pcs', temperature: '162.5 °C', lastUpdate: '7m 17s ago' },
  { id: 'MLD-102', name: 'Molder 102', workplaceId: '', status: 'Unknown', partnumber: '-', material: '-', cycleTime: '-', amountShift: '0 pcs', prevShift: '—', temperature: '-', lastUpdate: '-' },
  { id: 'MLD-103', name: 'Molder 103', workplaceId: '', status: 'Unknown', partnumber: '-', material: '-', cycleTime: '-', amountShift: '0 pcs', prevShift: '—', temperature: '-', lastUpdate: '-' },
  { id: 'MLD-104', name: 'Molder 104', workplaceId: 'WP-10004', status: 'Setup', partnumber: 'PN-220824', material: 'MAT-4790', cycleTime: '11.4 min', amountShift: '0 pcs', prevShift: '0 pcs', temperature: '172.2 °C', lastUpdate: '9h 10m ago' },
  { id: 'MLD-105', name: 'Molder 105', workplaceId: 'WP-10005', status: 'Unknown', partnumber: '-', material: '-', cycleTime: '-', amountShift: '0 pcs', prevShift: '—', temperature: '-', lastUpdate: '-' },
  { id: 'MLD-106', name: 'Molder 106', workplaceId: 'WP-10006', status: 'Automatic', partnumber: 'PN-220750', material: 'MAT-4590', cycleTime: '8.3 min', amountShift: '12 pcs', prevShift: '258 pcs', temperature: '165.1 °C', lastUpdate: '1m 47s ago' },
  { id: 'MLD-107', name: 'Molder 107', workplaceId: 'WP-10007', status: 'Stop', partnumber: 'PN-220752', material: 'MAT-4090', cycleTime: '10.7 min', amountShift: '0 pcs', prevShift: '54 pcs', temperature: '162.2 °C', lastUpdate: '6h 21m ago' },
  { id: 'MLD-108', name: 'Molder 108', workplaceId: 'WP-10008', status: 'Manual', partnumber: 'PN-220824', material: 'MAT-4790', cycleTime: '11.1 min', amountShift: '0 pcs', prevShift: '186 pcs', temperature: '177.9 °C', lastUpdate: '57m 17s ago' },
  { id: 'MLD-109', name: 'Molder 109', workplaceId: '', status: 'Unknown', partnumber: '-', material: '-', cycleTime: '-', amountShift: '0 pcs', prevShift: '—', temperature: '-', lastUpdate: '-' },
  { id: 'MLD-110', name: 'Molder 110', workplaceId: 'WP-10010', status: 'Automatic', partnumber: 'PN-220760', material: 'MAT-4600', cycleTime: '9.2 min', amountShift: '8 pcs', prevShift: '190 pcs', temperature: '168.3 °C', lastUpdate: '3m 22s ago' },
  { id: 'MLD-111', name: 'Molder 111', workplaceId: '', status: 'Unknown', partnumber: '-', material: '-', cycleTime: '-', amountShift: '0 pcs', prevShift: '—', temperature: '-', lastUpdate: '-' },
];

const statusColors = {
  Automatic: { header: 'bg-green-700', border: 'border-green-600', text: 'text-green-600 dark:text-green-400' },
  Unknown: { header: 'bg-gray-600', border: 'border-gray-400', text: 'text-gray-500 dark:text-gray-400' },
  Setup: { header: 'bg-fuchsia-700', border: 'border-fuchsia-500', text: 'text-fuchsia-600 dark:text-fuchsia-400' },
  Stop: { header: 'bg-red-700', border: 'border-red-500', text: 'text-red-600 dark:text-red-400' },
  Manual: { header: 'bg-gray-700', border: 'border-yellow-400', text: 'text-yellow-600 dark:text-yellow-400' },
};

const MachineCard = ({ machine }) => {
  const colors = statusColors[machine.status] || statusColors.Unknown;
  const fields = [
    ['Status', machine.status],
    ['Partnumber', machine.partnumber],
    ['Material', machine.material],
    ['Cycle time', machine.cycleTime],
    ['Amount parts (shift)', machine.amountShift],
    ['Prev shift parts', machine.prevShift],
    ['Temperature', machine.temperature],
    ['Last update', machine.lastUpdate],
  ];

  return (
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-1">{machine.name}</p>
      <div className={`rounded-lg border-2 ${colors.border} overflow-hidden bg-white dark:bg-gray-800 shadow`}>
        <div className={`${colors.header} px-3 py-2`}>
          <div className="text-white font-bold text-sm">{machine.name}</div>
          <div className="text-white/80 text-xs">Workplace ID: {machine.workplaceId || '-'}</div>
        </div>
        <div className="px-3 py-2 space-y-1">
          {fields.map(([label, value]) => (
            <div key={label} className="flex justify-between items-baseline text-xs">
              <span className="text-gray-600 dark:text-gray-400">{label}</span>
              <span className={`font-semibold ${label === 'Status' ? colors.text : 'text-gray-900 dark:text-white'}`}>{value}</span>
            </div>
          ))}
        </div>
        <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700">
          <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">↗ Open Level 2</button>
        </div>
      </div>
    </div>
  );
};

const MachineCardDashboard = ({ darkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusCounts = machineCardData.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Machine Card Overview</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Production molding machines — real-time status</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(statusCounts).map(([status, count]) => {
              const colors = statusColors[status] || statusColors.Unknown;
              return (
                <span key={status} className={`text-xs px-2 py-1 rounded-full ${colors.header} text-white`}>
                  {status}: {count}
                </span>
              );
            })}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentTime.toLocaleTimeString('en-GB')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {machineCardData.map(machine => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
    </div>
  );
};

// ============================================
// HOURLY PRODUCTION OUTPUT DASHBOARD
// ============================================

const hourlyProductionData = [
  { time: 'Tu 14:00', ok: 41, nok: 1 },
  { time: 'Tu 15:00', ok: 342, nok: 2 },
  { time: 'Tu 16:00', ok: 218, nok: 0 },
  { time: 'Tu 17:00', ok: 404, nok: 0 },
  { time: 'Tu 18:00', ok: 320, nok: 0 },
  { time: 'Tu 19:00', ok: 349, nok: 0 },
  { time: 'Tu 20:00', ok: 383, nok: 0 },
  { time: 'Tu 21:00', ok: 319, nok: 0 },
  { time: 'Tu 22:00', ok: 234, nok: 0 },
  { time: 'Tu 23:00', ok: 437, nok: 0 },
  { time: 'We 00:00', ok: 422, nok: 0 },
  { time: 'We 01:00', ok: 423, nok: 0 },
  { time: 'We 02:00', ok: 439, nok: 0 },
  { time: 'We 03:00', ok: 362, nok: 0 },
  { time: 'We 04:00', ok: 416, nok: 0 },
  { time: 'We 05:00', ok: 404, nok: 0 },
  { time: 'We 06:00', ok: 420, nok: 0 },
  { time: 'We 07:00', ok: 379, nok: 0 },
  { time: 'We 08:00', ok: 421, nok: 0 },
  { time: 'We 09:00', ok: 409, nok: 0 },
  { time: 'We 10:00', ok: 399, nok: 0 },
  { time: 'We 11:00', ok: 284, nok: 0 },
  { time: 'We 12:00', ok: 357, nok: 0 },
  { time: 'We 13:00', ok: 346, nok: 0 },
  { time: 'We 14:00', ok: 5, nok: 0 },
];

const machineStatusSegments = [
  { width: 8, status: 'running' },
  { width: 4, status: 'idle' },
  { width: 15, status: 'running' },
  { width: 3, status: 'downtime' },
  { width: 20, status: 'running' },
  { width: 5, status: 'idle' },
  { width: 25, status: 'running' },
  { width: 10, status: 'idle' },
  { width: 10, status: 'running' },
];

const HourlyProductionDashboard = ({ darkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalOk = hourlyProductionData.reduce((s, d) => s + d.ok, 0);
  const totalNok = hourlyProductionData.reduce((s, d) => s + d.nok, 0);
  const lineData = [
    { name: 'Line 1', ok: 2820, nok: 0 },
    { name: 'Line 2', ok: 3075, nok: 0 },
    { name: 'Line 3', ok: 3130, nok: 0 },
  ];
  const maxVal = 450;

  const statusColors = { running: 'bg-green-500', idle: 'bg-amber-400', downtime: 'bg-red-500' };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Hourly Production Output</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Production Line Overview — Parts per Hour</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Order Start</div>
          <div className="text-lg font-bold font-mono text-gray-900 dark:text-white">2026-02-04 09:32:00</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'OK Current Order', value: '5,940' },
          { label: 'OK in Interval', value: totalOk.toLocaleString() },
          { label: 'NOK in Interval', value: String(totalNok) },
          { label: 'Part Number', value: 'PT-6650-001', mono: true },
          { label: 'Order Number', value: 'ORD-2024-0042', mono: true },
          { label: 'Order Start', value: '2026-02-04\n09:32:00.000', mono: true, small: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">{kpi.label}</div>
            <div className={`${kpi.small ? 'text-lg' : 'text-2xl'} font-bold text-gray-900 dark:text-white ${kpi.mono ? 'font-mono' : ''}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lineData.map((line, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 text-center text-sm font-bold text-gray-600 dark:text-gray-300">{line.name}</div>
            <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-700">
              <div className="p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parts OK</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{line.ok.toLocaleString()}</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Parts NOK</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{line.nok}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Produced Parts per Hour</div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">Produced Quantity</div>
        <div className="overflow-x-auto">
          <svg width="100%" viewBox="0 0 1120 400" className="min-w-[700px]">
            {[0, 100, 200, 300, 400].map(val => {
              const y = 330 - (val / maxVal) * 280;
              return (
                <g key={val}>
                  <line x1="45" y1={y} x2="1100" y2={y} stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="1" />
                  <text x="40" y={y + 4} fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="10" textAnchor="end">{val}</text>
                </g>
              );
            })}
            {hourlyProductionData.map((d, i) => {
              const x = 55 + i * 42;
              const barH = (d.ok / maxVal) * 280;
              const y = 330 - barH;
              const nokH = (d.nok / maxVal) * 280;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={30} height={barH} fill="#4ade80" rx="2" />
                  {d.nok > 0 && <rect x={x} y={y - nokH} width={30} height={nokH} fill="#ef4444" rx="2" />}
                  <text x={x + 15} y={y - 5} fill={darkMode ? '#d1d5db' : '#374151'} fontSize="9" textAnchor="middle" fontWeight="bold">{d.ok}</text>
                  <text x={x + 15} y={345} fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="8" textAnchor="end" transform={`rotate(-45,${x + 15},345)`}>{d.time}</text>
                </g>
              );
            })}
            <rect x="55" y="385" width="12" height="8" fill="#4ade80" />
            <text x="71" y="393" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="9">ok</text>
            <rect x="95" y="385" width="12" height="8" fill="#ef4444" />
            <text x="111" y="393" fill={darkMode ? '#9ca3af' : '#6b7280'} fontSize="9">nok</text>
          </svg>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Machine Status</div>
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-sm mr-1 align-middle" /> Running
          <span className="inline-block w-3 h-3 bg-amber-400 rounded-sm mr-1 ml-3 align-middle" /> Idle (planned)
          <span className="inline-block w-3 h-3 bg-red-500 rounded-sm mr-1 ml-3 align-middle" /> Downtime
        </div>
        <div className="flex rounded overflow-hidden h-8">
          {machineStatusSegments.map((seg, i) => (
            <div key={i} className={`${statusColors[seg.status]} h-full`} style={{ width: `${seg.width}%` }} />
          ))}
        </div>
        <div className="flex justify-between mt-1">
          {['15:00', '17:00', '19:00', '21:00', '23:00', '01:00', '03:00', '05:00', '07:00', '09:00', '11:00', '13:00', '15:00'].map((t, i) => (
            <span key={i} className="text-xs text-gray-500 dark:text-gray-400">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// AUTOCLAVE PROCESS VALUES DASHBOARD
// ============================================

const generateAutoclaveTemperatureData = (isActive) => {
  const points = [];
  for (let i = 0; i < 48; i++) {
    const hour = 22 + Math.floor(i * 12 / 48);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    const minutes = Math.floor((i * 12 / 48 - Math.floor(i * 12 / 48)) * 60);
    const timeLabel = `${String(adjustedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    let actual;
    if (isActive) {
      if (i < 6) actual = 170 + Math.random() * 15;
      else if (i < 12) actual = 155 + Math.random() * 20 - 40 * Math.sin(i * 0.8);
      else if (i < 30) actual = 160 + Math.random() * 15 + 10 * Math.sin(i * 0.5);
      else if (i < 36) actual = 80 + Math.random() * 30;
      else actual = 165 + Math.random() * 10;
    } else {
      if (i < 10) actual = 27 + Math.random() * 2;
      else if (i < 14) actual = 27 + (i - 10) * 5 + Math.random() * 3;
      else actual = 27 + Math.random() * 2;
    }
    points.push({ time: timeLabel, actual, index: i });
  }
  return points;
};

const generateAutoclavePressureData = (isActive) => {
  const points = [];
  for (let i = 0; i < 48; i++) {
    const hour = 22 + Math.floor(i * 12 / 48);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    const minutes = Math.floor((i * 12 / 48 - Math.floor(i * 12 / 48)) * 60);
    const timeLabel = `${String(adjustedHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    let actual;
    if (isActive) {
      actual = 10.2 + Math.random() * 0.6 - 0.3;
      if (i > 30 && i < 36) actual = 5 + Math.random() * 2;
    } else {
      actual = 0;
    }
    points.push({ time: timeLabel, actual, index: i });
  }
  return points;
};

const generateCycleTimesData = (isActive) => {
  if (!isActive) return [];
  return Array.from({ length: 16 }, (_, i) => ({
    cycle: i + 1,
    time: 24.0 + Math.random() * 0.8 - 0.4
  }));
};

const autoclaveConfigs = [
  {
    id: 'AC-01',
    name: 'Autoclave 3',
    active: true,
    mode: 'Running',
    heatMaintainSec: 101.1,
    heatMaintainMin: 1.7,
    cyclesShift: 12,
    lastCycleTime: 24.4,
    programNumber: 'AEM (VAMAC)',
    temperature: 186.00,
    pressure: 10.50,
    setpointPressure: 10.50,
    setpointHeatingTime: 90.00,
  },
  {
    id: 'AC-02',
    name: 'Autoclave 4',
    active: false,
    mode: '-',
    heatMaintainSec: 0,
    heatMaintainMin: 0,
    cyclesShift: '-',
    lastCycleTime: '-',
    programNumber: 'CM CoEx',
    temperature: 27.00,
    pressure: 0,
    setpointPressure: 9.60,
    setpointHeatingTime: 90.00,
  }
];

const AutoclaveChart = ({ title, data, yMin, yMax, yStep, yUnit, lines, darkMode, height = 160 }) => {
  const chartW = 480, chartH = height, padL = 60, padR = 10, padT = 10, padB = 30;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const yRange = yMax - yMin;

  const toX = (i) => padL + (i / (data.length - 1)) * plotW;
  const toY = (val) => padT + plotH - ((val - yMin) / yRange) * plotH;

  const yTicks = [];
  for (let v = yMin; v <= yMax; v += yStep) yTicks.push(v);

  const xTickInterval = Math.max(1, Math.floor(data.length / 6));

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">{title}</p>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        <rect x={padL} y={padT} width={plotW} height={plotH} fill={darkMode ? '#1a1a2e' : '#f8fafc'} />
        {yTicks.map(v => (
          <g key={v}>
            <line x1={padL} y1={toY(v)} x2={padL + plotW} y2={toY(v)} stroke={darkMode ? '#374151' : '#e2e8f0'} strokeWidth="0.5" />
            <text x={padL - 4} y={toY(v) + 3} textAnchor="end" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{v.toFixed(yStep < 1 ? 2 : 0)} {yUnit}</text>
          </g>
        ))}
        {data.filter((_, i) => i % xTickInterval === 0).map(d => (
          <text key={d.index} x={toX(d.index)} y={chartH - 4} textAnchor="middle" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{d.time}</text>
        ))}
        {lines.map(line => {
          if (line.type === 'data') {
            const pathD = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(d.actual).toFixed(1)}`).join(' ');
            return <path key={line.label} d={pathD} fill="none" stroke={line.color} strokeWidth="1.5" />;
          }
          const y = toY(line.value);
          return <line key={line.label} x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={line.color} strokeWidth="1" strokeDasharray="4,2" />;
        })}
      </svg>
      <div className="flex justify-center gap-4 mt-1">
        {lines.map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className="w-3 h-0.5 inline-block" style={{ backgroundColor: l.color }} />
            <span className="text-[10px] text-gray-600 dark:text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CycleTimesChart = ({ data, darkMode }) => {
  if (data.length === 0) return (
    <div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">Cycle Times</p>
      <div className="h-24 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">No data</div>
    </div>
  );

  const chartW = 480, chartH = 120, padL = 40, padR = 10, padT = 10, padB = 20;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  const maxVal = 100;
  const barW = Math.min(20, plotW / data.length - 2);

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">Cycle Times</p>
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {[0, 25, 50, 75, 100].map(v => {
          const y = padT + plotH - (v / maxVal) * plotH;
          return (
            <g key={v}>
              <line x1={padL} y1={y} x2={padL + plotW} y2={y} stroke={darkMode ? '#374151' : '#e2e8f0'} strokeWidth="0.5" />
              <text x={padL - 4} y={y + 3} textAnchor="end" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>{v}</text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const x = padL + (i / data.length) * plotW + (plotW / data.length - barW) / 2;
          const barH = (d.time / maxVal) * plotH;
          const y = padT + plotH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} fill="#3b82f6" rx="1" />
              <text x={x + barW / 2} y={y - 2} textAnchor="middle" fontSize="6" fill={darkMode ? '#d1d5db' : '#475569'}>{d.time.toFixed(1)}</text>
            </g>
          );
        })}
        <text x={padL - 4} y={padT - 2} textAnchor="end" fontSize="7" fill={darkMode ? '#9ca3af' : '#64748b'}>min</text>
      </svg>
    </div>
  );
};

const AutoclaveProcessDashboard = ({ darkMode }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Autoclave Process Values</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real-time monitoring of autoclave curing parameters</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentTime.toLocaleDateString('en-GB')} {currentTime.toLocaleTimeString('en-GB')}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {autoclaveConfigs.map(ac => {
          const tempData = generateAutoclaveTemperatureData(ac.active);
          const pressureData = generateAutoclavePressureData(ac.active);
          const cycleData = generateCycleTimesData(ac.active);

          return (
            <div key={ac.id} className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <h3 className="text-lg font-bold text-center text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">{ac.name}</h3>

              {/* Machine Status Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className={`rounded-lg p-2 text-center ${ac.active ? 'bg-green-600' : 'bg-red-700'}`}>
                  <div className="text-[10px] text-white/80 uppercase">Machine Mode</div>
                  <div className="text-lg font-bold text-white">{ac.mode}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Heat maintain time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{ac.heatMaintainSec} <span className="text-xs font-normal text-gray-500">sec</span></div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Heat maintain time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{ac.heatMaintainMin} <span className="text-xs font-normal text-gray-500">min</span></div>
                </div>
              </div>

              {/* Cycle Info Row */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Cycles/Actual shift</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{ac.cyclesShift}</div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Last Cycle Time</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {ac.lastCycleTime !== '-' ? <>{ac.lastCycleTime} <span className="text-xs font-normal text-green-600">min</span></> : '-'}
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Program Number</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">{ac.programNumber}</div>
                </div>
              </div>

              {/* Process Values Row */}
              <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Temperatur [°C]</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{ac.temperature.toFixed(2)} <span className="text-xs font-normal text-gray-500">°C</span></div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Pressure [bar]</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{ac.pressure.toFixed(2)} <span className="text-xs font-normal text-gray-500">bar</span></div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Setpoint Pressure [bar]</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{ac.setpointPressure.toFixed(2)} <span className="text-xs font-normal text-gray-500">bar</span></div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-750 border border-gray-200 dark:border-gray-600 rounded-lg p-2 text-center">
                  <div className="text-[10px] text-gray-500 dark:text-gray-400 uppercase">Setpoint Heating [sec]</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{ac.setpointHeatingTime.toFixed(2)} <span className="text-xs font-normal text-gray-500">sec</span></div>
                </div>
              </div>

              {/* Temperature Chart */}
              <AutoclaveChart
                title="Temperatur [°C]"
                data={tempData}
                yMin={ac.active ? 50 : 0}
                yMax={200}
                yStep={50}
                yUnit="°C"
                darkMode={darkMode}
                lines={[
                  { type: 'data', label: 'Actual Value', color: '#22c55e' },
                  { type: 'limit', label: 'Lower Limit', value: ac.active ? 100 : 20, color: '#f59e0b' },
                  { type: 'limit', label: 'Upper Limit', value: 200, color: '#ef4444' },
                ]}
              />

              {/* Pressure Chart */}
              <AutoclaveChart
                title="Pressure [bar]"
                data={pressureData}
                yMin={0}
                yMax={12}
                yStep={2.5}
                yUnit="bar"
                darkMode={darkMode}
                lines={[
                  { type: 'data', label: 'Actual Value', color: '#22c55e' },
                  { type: 'limit', label: 'Setpoint', value: ac.setpointPressure, color: '#f59e0b' },
                  { type: 'limit', label: 'Upper Limit', value: 11, color: '#ef4444' },
                  { type: 'limit', label: 'Lower Limit', value: ac.active ? 9 : 0, color: '#fb923c' },
                ]}
              />

              {/* Cycle Times Chart */}
              <CycleTimesChart data={cycleData} darkMode={darkMode} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// COMING SOON VIEW
// ============================================

const ComingSoonView = ({ title, description, icon: Icon }) => (
  <div className="p-6">
    <div className="max-w-2xl mx-auto text-center py-20">
      <div className="mb-6 flex justify-center">
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Icon className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">{description}</p>
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <p className="text-blue-800 dark:text-blue-300 font-medium">
          This use case is currently under development. Check back soon!
        </p>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN APP
// ============================================

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('curing-oven');

  const useCases = [
    {
      id: 'curing-oven',
      name: 'Curing Oven Process',
      icon: Gauge,
      description: 'Temperature, conveyor and curing cycle control',
      component: CuringOvenDashboard
    },
    {
      id: 'production-tracking',
      name: 'Production Tracking',
      icon: ClipboardList,
      description: 'Hourly production monitoring and KPIs',
      component: ProductionTrackingDashboard
    },
    {
      id: 'andon-board',
      name: 'Andon Board',
      icon: Monitor,
      description: 'Real-time machine status and shift output',
      component: AndonBoardDashboard
    },
    {
      id: 'machine-cards',
      name: 'Machine Card View',
      icon: Factory,
      description: 'Production machine status cards overview',
      component: MachineCardDashboard
    },
    {
      id: 'hourly-production',
      name: 'Hourly Production Output',
      icon: BarChart3,
      description: 'Parts per hour with machine status',
      component: HourlyProductionDashboard
    },
    {
      id: 'autoclave-process',
      name: 'Autoclave Process Values',
      icon: Thermometer,
      description: 'Temperature, pressure and cycle monitoring',
      component: AutoclaveProcessDashboard
    },
    {
      id: 'energy-management',
      name: 'Energy Management',
      icon: Zap,
      description: 'Power consumption and optimization',
      component: () => <ComingSoonView title="Energy Management" description="Monitor and optimize power consumption" icon={Zap} />
    },
    {
      id: 'quality-control',
      name: 'Quality Control',
      icon: Activity,
      description: 'Inspection and defect tracking',
      component: () => <ComingSoonView title="Quality Control" description="Track quality metrics in real-time" icon={Activity} />
    },
    {
      id: 'inventory',
      name: 'Inventory Tracking',
      icon: Package,
      description: 'Material flow and stock levels',
      component: () => <ComingSoonView title="Inventory Tracking" description="Real-time material flow visibility" icon={Package} />
    }
  ];

  const activeUseCase = useCases.find(uc => uc.id === activeView);
  const ActiveComponent = activeUseCase?.component;

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md shrink-0 z-50">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Industrial Dashboard Suite</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Interactive Click Dummy</p>
            </div>
          </div>
          <button onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} shrink-0 transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <div className="w-80 h-full overflow-y-auto p-4">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">Use Cases</h2>
            <div className="space-y-2">
              {useCases.map(uc => (
                <button key={uc.id} onClick={() => setActiveView(uc.id)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    activeView === uc.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-2 border-transparent'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activeView === uc.id ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                    }`}>
                      <uc.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold mb-1 ${
                        activeView === uc.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'
                      }`}>{uc.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{uc.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-auto">
          {ActiveComponent && <ActiveComponent darkMode={darkMode} />}
        </main>
      </div>
    </div>
  );
}