import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Footprints, Plus, RotateCcw, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const STEP_THRESHOLD = 12;        // acceleration magnitude threshold
const STEP_DELAY = 300;           // minimum ms between steps
const STEPS_PER_BATCH = 100;      // send to backend every 100 steps

const StepCounter = () => {
  const { user, refreshUser } = useAuth();
  const [currentSteps, setCurrentSteps] = useState(0);
  const [totalSteps, setTotalSteps] = useState(user?.totalSteps || 0);
  const [permission, setPermission] = useState(false);
  const [supported, setSupported] = useState(true);
  const [manualCount, setManualCount] = useState('');
  const [status, setStatus] = useState('checking'); // checking, active, unsupported, permission-denied
  const lastStepTime = useRef(0);
  const stepBuffer = useRef([]);
  const motionTimeout = useRef(null);

  useEffect(() => {
    // Check if DeviceMotionEvent is supported
    if (!window.DeviceMotionEvent) {
      setSupported(false);
      setStatus('unsupported');
      return;
    }

    // iOS 13+ requires explicit permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            setPermission(true);
            setStatus('active');
            window.addEventListener('devicemotion', handleMotion);
          } else {
            setPermission(false);
            setStatus('permission-denied');
          }
        })
        .catch(err => {
          console.error('Permission error:', err);
          setPermission(false);
          setStatus('permission-denied');
        });
    } else {
      // Android / other browsers
      setPermission(true);
      setStatus('active');
      window.addEventListener('devicemotion', handleMotion);
    }

    // Set a timeout to detect if motion events are not firing
    motionTimeout.current = setTimeout(() => {
      if (status === 'active' && lastStepTime.current === 0) {
        setStatus('waiting');
      }
    }, 5000);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      clearTimeout(motionTimeout.current);
    };
  }, []);

  const handleMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    // Update last step time to indicate motion is happening
    lastStepTime.current = Date.now();
    if (status === 'waiting') setStatus('active');

    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      (acceleration.x || 0) ** 2 +
      (acceleration.y || 0) ** 2 +
      (acceleration.z || 0) ** 2
    );

    const now = Date.now();

    // Simple peak detection: magnitude exceeds threshold and enough time passed
    if (magnitude > STEP_THRESHOLD && now - lastStepTime.current > STEP_DELAY) {
      lastStepTime.current = now;
      setCurrentSteps(prev => {
        const newSteps = prev + 1;
        if (newSteps >= STEPS_PER_BATCH) {
          addToTotal(STEPS_PER_BATCH);
          return 0;
        }
        return newSteps;
      });
    }
  };

  const addToTotal = async (stepsToAdd) => {
    try {
      const { data } = await axios.post('/user/steps', { steps: stepsToAdd });
      if (data.success) {
        setTotalSteps(data.totalSteps);
        if (refreshUser) await refreshUser();
        toast.success(`${stepsToAdd} steps added!`);
      }
    } catch (error) {
      console.error('Failed to update steps:', error);
      toast.error('Could not sync steps to server.');
    }
  };

  const handleManualAdd = () => {
    const steps = parseInt(manualCount, 10);
    if (isNaN(steps) || steps <= 0) {
      toast.error('Enter a valid positive number');
      return;
    }
    addToTotal(steps);
    setManualCount('');
  };

  const handleReset = () => {
    if (window.confirm('Reset today’s step counter? (Total steps will not be affected)')) {
      setCurrentSteps(0);
    }
  };

  const progress = (currentSteps / STEPS_PER_BATCH) * 100;

  const renderContent = () => {
    switch (status) {
      case 'checking':
        return (
          <div className="flex flex-col items-center py-6">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
            <p className="text-sm text-slate-500">Checking step counter...</p>
          </div>
        );
      case 'unsupported':
        return (
          <div className="text-center py-6">
            <p className="text-amber-600 text-sm font-medium">This feature is under processing and not supported on your device.</p>
          </div>
        );
      case 'permission-denied':
        return (
          <div className="text-center py-6">
            <p className="text-amber-600 text-sm font-medium">Motion permission required. Please grant access to count steps.</p>
            <button
              onClick={() => {
                if (typeof DeviceMotionEvent.requestPermission === 'function') {
                  DeviceMotionEvent.requestPermission()
                    .then(permissionState => {
                      if (permissionState === 'granted') {
                        setPermission(true);
                        setStatus('active');
                        window.addEventListener('devicemotion', handleMotion);
                      }
                    })
                    .catch(console.error);
                }
              }}
              className="mt-4 px-4 py-2 bg-amber-600 text-white rounded-xl text-sm font-semibold"
            >
              Grant Permission
            </button>
          </div>
        );
      case 'waiting':
        return (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm">Waiting for motion data... Try moving your device.</p>
          </div>
        );
      case 'active':
      default:
        return (
          <>
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100 stroke-current"
                  strokeWidth="10"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                />
                <circle
                  className="text-emerald-500 stroke-current transition-all duration-300"
                  strokeWidth="10"
                  strokeLinecap="round"
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-2xl font-black text-slate-800">{currentSteps}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">steps</span>
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-slate-500">Total Steps (All Time)</p>
              <p className="text-3xl font-black text-emerald-700">{totalSteps.toLocaleString()}</p>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="number"
                min="1"
                value={manualCount}
                onChange={(e) => setManualCount(e.target.value)}
                placeholder="Add steps"
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm"
              />
              <button
                onClick={handleManualAdd}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-2 text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <RotateCcw size={14} /> Reset today's counter
            </button>
          </>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-xl">
            <Footprints className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-800">Step Counter</h3>
        </div>
        {status === 'active' && (
          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full animate-pulse">
            Active
          </span>
        )}
      </div>

      {renderContent()}
    </div>
  );
};

export default StepCounter;