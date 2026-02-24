import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import { Footprints, Award, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const StepCounter = () => {
  const { user, refreshUser } = useAuth();
  const [currentSteps, setCurrentSteps] = useState(0);
  const [permission, setPermission] = useState(false);
  const [supported, setSupported] = useState(true);
  const [totalSteps, setTotalSteps] = useState(user?.totalSteps || 0);
  const [manualAdd, setManualAdd] = useState('');
  const stepBuffer = useRef([]);
  const lastStepTime = useRef(0);
  const STEP_THRESHOLD = 12; // acceleration magnitude threshold
  const STEP_DELAY = 300; // ms between steps

  useEffect(() => {
    // Check if DeviceMotionEvent is supported
    if (!window.DeviceMotionEvent) {
      setSupported(false);
      toast.error('Step counter not supported on this device.');
      return;
    }

    // iOS 13+ requires permission
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            setPermission(true);
            window.addEventListener('devicemotion', handleMotion);
          } else {
            setPermission(false);
            toast.error('Motion permission denied. Steps will not be counted.');
          }
        })
        .catch(console.error);
    } else {
      // Android / other browsers
      setPermission(true);
      window.addEventListener('devicemotion', handleMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  const handleMotion = (event) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    // Calculate magnitude of acceleration
    const magnitude = Math.sqrt(
      acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
    );

    const now = Date.now();

    // Simple peak detection: magnitude exceeds threshold and enough time passed
    if (magnitude > STEP_THRESHOLD && now - lastStepTime.current > STEP_DELAY) {
      lastStepTime.current = now;
      setCurrentSteps(prev => {
        const newSteps = prev + 1;
        if (newSteps >= 100) {
          // Add 100 to total steps
          addToTotal(100);
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
        // Optionally refresh user context
        if (refreshUser) await refreshUser();
      }
    } catch (error) {
      toast.error('Failed to update total steps');
    }
  };

  const handleManualAdd = () => {
    const steps = parseInt(manualAdd, 10);
    if (isNaN(steps) || steps <= 0) {
      toast.error('Enter a valid positive number');
      return;
    }
    addToTotal(steps);
    setManualAdd('');
  };

  const progress = (currentSteps / 100) * 100;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-100 rounded-xl">
          <Footprints className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="font-bold text-slate-800">Step Counter</h3>
      </div>

      {!supported && (
        <p className="text-red-500 text-sm">Step counter not supported on this device.</p>
      )}

      {supported && !permission && (
        <p className="text-amber-500 text-sm">Motion permission required to count steps.</p>
      )}

      {supported && permission && (
        <>
          {/* Circular Progress */}
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
            <p className="text-sm text-slate-500">Total Steps</p>
            <p className="text-3xl font-black text-emerald-700">{totalSteps.toLocaleString()}</p>
          </div>

          {/* Manual add fallback */}
          <div className="flex gap-2">
            <input
              type="number"
              min="1"
              value={manualAdd}
              onChange={(e) => setManualAdd(e.target.value)}
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
        </>
      )}
    </div>
  );
};

export default StepCounter;