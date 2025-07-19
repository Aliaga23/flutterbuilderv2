import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import * as LucideIcons from 'lucide-react';

const SelectorContainer = styled.div`
  position: relative;
  margin-top: 8px;
`;

const SelectorButton = styled.button`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }

  &:hover {
    border-color: #2196f3;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px;
  border: none;
  border-bottom: 1px solid #ddd;
  font-size: 14px;

  &:focus {
    outline: none;
    border-bottom-color: #2196f3;
  }
`;

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
  gap: 4px;
  padding: 8px;
  max-height: 150px;
  overflow-y: auto;
`;

const IconOption = styled.button<{ isSelected: boolean }>`
  padding: 8px;
  border: 1px solid ${props => props.isSelected ? '#2196f3' : '#ddd'};
  border-radius: 4px;
  background: ${props => props.isSelected ? '#e3f2fd' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2196f3;
    background: #f5f5f5;
  }

  &:focus {
    outline: none;
    border-color: #2196f3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

interface IconSelectorProps {
  value: string;
  onChange: (iconName: string) => void;
  placeholder?: string;
}

// Common icons for Flutter apps
const COMMON_ICONS = [
  'Home', 'Search', 'User', 'Settings', 'Heart', 'Star', 'Plus', 'Minus',
  'X', 'Check', 'ChevronLeft', 'ChevronRight', 'ChevronUp', 'ChevronDown',
  'Menu', 'MoreHorizontal', 'MoreVertical', 'Edit', 'Trash2', 'Save',
  'Download', 'Upload', 'Share', 'Copy', 'ExternalLink', 'Eye', 'EyeOff',
  'Lock', 'Unlock', 'Bell', 'BellOff', 'Mail', 'Phone', 'Camera',
  'Image', 'Video', 'Music', 'Play', 'Pause', 'Stop', 'SkipBack',
  'SkipForward', 'Volume2', 'VolumeX', 'Wifi', 'Battery', 'Bluetooth',
  'Calendar', 'Clock', 'MapPin', 'Navigation', 'Compass', 'Globe',
  'ShoppingCart', 'CreditCard', 'DollarSign', 'Tag', 'Package',
  'Truck', 'Users', 'UserPlus', 'UserMinus', 'MessageCircle', 'Send'
];

export function IconSelector({ value, onChange, placeholder = "Select icon" }: IconSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIcons = useMemo(() => {
    if (!searchTerm) {
      return COMMON_ICONS;
    }
    return COMMON_ICONS.filter(iconName =>
      iconName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const selectedIcon = useMemo(() => {
    return value && (LucideIcons as any)[value] ? value : null;
  }, [value]);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchTerm('');
  };

  const SelectedIconComponent = selectedIcon ? (LucideIcons as any)[selectedIcon] : null;

  return (
    <SelectorContainer>
      <SelectorButton onClick={() => setIsOpen(!isOpen)}>
        <ButtonContent>
          {SelectedIconComponent ? (
            <>
              <SelectedIconComponent size={16} />
              <span>{selectedIcon}</span>
            </>
          ) : (
            <span style={{ color: '#999' }}>{placeholder}</span>
          )}
        </ButtonContent>
        <LucideIcons.ChevronDown size={16} />
      </SelectorButton>

      {isOpen && (
        <>
          <Overlay onClick={() => setIsOpen(false)} />
          <Dropdown isOpen={isOpen}>
            <SearchInput
              type="text"
              placeholder="Search icons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <IconGrid>
              {filteredIcons.map(iconName => {
                const IconComponent = (LucideIcons as any)[iconName];
                if (!IconComponent) return null;

                return (
                  <IconOption
                    key={iconName}
                    isSelected={selectedIcon === iconName}
                    onClick={() => handleSelect(iconName)}
                    title={iconName}
                  >
                    <IconComponent size={16} />
                  </IconOption>
                );
              })}
            </IconGrid>
          </Dropdown>
        </>
      )}
    </SelectorContainer>
  );
}
