import React from 'react';
import styled from 'styled-components';
import { DEVICE_TYPES } from '../constants/widgets';
import { useApp } from '../context/AppContext';

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #FFFFFF;
  border-bottom: 1px solid #E1E5E9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const SelectorLabel = styled.label`
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-right: 12px;
  letter-spacing: -0.025em;
`;

const DeviceSelect = styled.select`
  padding: 12px 16px;
  border: 1px solid #D1D5DB;
  border-radius: 10px;
  font-size: 14px;
  font-family: inherit;
  background: #FFFFFF;
  color: #374151;
  cursor: pointer;
  min-width: 200px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:hover {
    border-color: #9CA3AF;
  }
`;

const DeviceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #64748B;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #E5E7EB;
  font-weight: 500;
`;

const DeviceIcon = styled.span`
  font-size: 18px;
  filter: grayscale(0.3);
`;

export function DeviceSelector() {
  const { state, dispatch } = useApp();
  const currentDevice = DEVICE_TYPES.find(device => device.id === state.project.selectedDeviceId);

  const handleDeviceChange = (deviceId: string) => {
    dispatch({ type: 'SET_DEVICE', payload: deviceId });
  };

  return (
    <SelectorContainer>
      <SelectorLabel>Device:</SelectorLabel>
      <DeviceSelect
        value={state.project.selectedDeviceId}
        onChange={(e) => handleDeviceChange(e.target.value)}
      >
        {DEVICE_TYPES.map(device => (
          <option key={device.id} value={device.id}>
            {device.icon} {device.name}
          </option>
        ))}
      </DeviceSelect>
      
      {currentDevice && (
        <DeviceInfo>
          <DeviceIcon>{currentDevice.icon}</DeviceIcon>
          <span>{currentDevice.width} × {currentDevice.height}</span>
          <span>({currentDevice.pixelRatio}x)</span>
        </DeviceInfo>
      )}
    </SelectorContainer>
  );
}
