import React, { useState, useEffect } from 'react';
import { Gauge, ClipboardList, Zap, Activity, Package, ChevronLeft, ChevronRight, Moon, Sun, RefreshCw, Download } from 'lucide-react';

// ============================================
// MOCK DATA GENERATION
// ============================================

const generateTemperatureData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const hour = 10 + Math.floor(i * 12 / 60);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    
    let temp, setpoint;
    if (adjustedHour < 20) {
      temp = 227 + Math.random() * 2;
      setpoint = 228;
    } else if (adjustedHour >= 20 && adjustedHour < 22) {
      const progress = (adjustedHour - 20) / 2;
      temp = 227 - progress * 192 + Math.random() * 5;
      setpoint = 228 - progress * 193;
    } else if (adjustedHour >= 22 || adjustedHour < 4) {
      temp = 35 + Math.random() * 5;
      setpoint = 35;
    } else {
      const progress = (adjustedHour - 4) / 6;
      temp = 35 + progress * 192 + Math.random() * 5;
      setpoint = 35 + progress * 193;
    }
    
    data.push({
      actual: Math.max(30, Math.min(240, temp)),
      setpoint: Math.max(30, Math.min(240, setpoint)),
      min: Math.max(30, Math.min(240, temp - 10)),
      max: Math.max(30, Math.min(240, temp + 11))
    });
  }
  return data;
};

const generateConveyorData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const hour = 10 + Math.floor(i * 12 / 60);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    
    let speed = (adjustedHour >= 2 && adjustedHour < 4) ? 0 : 0.0999 + (Math.random() - 0.5) * 0.002;
    
    data.push({
      actual: Math.max(0, speed),
      setpoint: 0.1
    });
  }
  return data;
};

const generateStatusData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const hour = 10 + Math.floor(i * 12 / 60);
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    
    data.push({
      status: (adjustedHour >= 2 && adjustedHour < 4) ? 'Stopped' : 'Running'
    });
  }
  return data;
};

// ============================================
// THERMAL PROCESSING DASHBOARD
// ============================================

const ThermalProcessingDashboard = ({ darkMode }) => {
  const [tempData] = useState(generateTemperatureData());
  const [conveyorData] = useState(generateConveyorData());
  const [statusData] = useState(generateStatusData());
  
  const [currentTemp, setCurrentTemp] = useState({
    setpoint: 228,
    actual: 227,
    min: 218,
    max: 238
  });
  
  const [conveyorSpeed, setConveyorSpeed] = useState({
    setpoint: 0.100,
    actual: 0.0999
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
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Thermal Processing Unit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Line A | Zone 2 - Real-time Process Control
          </p>
        </div>
        <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg font-bold text-lg">
          ● Running
        </span>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-gray-600 dark:text-gray-400 text-sm mb-2">Active Program</div>
            <div className="text-blue-600 dark:text-blue-400 text-2xl font-bold">PROC-A-16-STD</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Temperature</div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Setpoint</div>
                <div className="text-amber-600 dark:text-amber-500 text-3xl font-bold">
                  {currentTemp.setpoint}<span className="text-xl">°C</span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Actual</div>
                <div className="text-green-600 dark:text-green-500 text-3xl font-bold">
                  {Math.round(currentTemp.actual)}<span className="text-xl">°C</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Minimum</div>
                <div className="text-blue-600 dark:text-blue-400 text-3xl font-bold">
                  {currentTemp.min}<span className="text-xl">°C</span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Maximum</div>
                <div className="text-red-600 dark:text-red-400 text-3xl font-bold">
                  {currentTemp.max}<span className="text-xl">°C</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Conveyor Speed</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Setpoint</div>
                <div className="text-amber-600 dark:text-amber-500 text-2xl font-bold">
                  {conveyorSpeed.setpoint.toFixed(3)}<span className="text-sm"> m/min</span>
                </div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Actual</div>
                <div className="text-green-600 dark:text-green-500 text-2xl font-bold">
                  {conveyorSpeed.actual.toFixed(4)}<span className="text-sm"> m/min</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Temp Start</div>
                <div className="text-gray-900 dark:text-white text-lg">2026-02-06 04:22:57</div>
              </div>
              <div>
                <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">Upheating Period</div>
                <div className="text-blue-600 dark:text-blue-400 text-4xl font-bold">
                  {formatTime(upheatingPeriod)}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-bold">Temperature Timeline (24h)</div>
            <div className="relative h-64 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <svg width="100%" height="100%" viewBox="0 0 800 250">
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <line key={i} x1="0" y1={i * 50} x2="800" y2={i * 50} 
                    stroke={darkMode ? "#374151" : "#e5e7eb"} strokeWidth="1"/>
                ))}
                {['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00', '08:00'].map((time, i) => (
                  <text key={i} x={i * 66.67 + 10} y="245" fill={darkMode ? "#9ca3af" : "#6b7280"} fontSize="10">
                    {time}
                  </text>
                ))}
                <polyline
                  points={tempData.map((d, i) => `${i * 8},${250 - (d.setpoint / 250 * 250)}`).join(' ')}
                  fill="none" stroke="#f59e0b" strokeWidth="2"/>
                <polyline
                  points={tempData.map((d, i) => `${i * 8},${250 - (d.actual / 250 * 250)}`).join(' ')}
                  fill="none" stroke="#10b981" strokeWidth="2"/>
              </svg>
            </div>
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
  const [activeView, setActiveView] = useState('thermal-processing');

  const useCases = [
    {
      id: 'thermal-processing',
      name: 'Thermal Processing',
      icon: Gauge,
      description: 'Real-time temperature and conveyor control',
      component: ThermalProcessingDashboard
    },
    {
      id: 'production-tracking',
      name: 'Production Tracking',
      icon: ClipboardList,
      description: 'Hourly production monitoring and KPIs',
      component: ProductionTrackingDashboard
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
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

      <div className="flex">
        <aside className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <div className="p-4">
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

        <main className="flex-1">
          {ActiveComponent && <ActiveComponent darkMode={darkMode} />}
        </main>
      </div>
    </div>
  );
}