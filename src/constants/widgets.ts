import { WidgetTemplate, DeviceType } from '../types';

export const WIDGET_TEMPLATES: WidgetTemplate[] = [
  {
    id: 'text',
    name: 'Text',
    category: 'Basic',
    icon: 'Type',
    hasChildren: false,
    description: 'Display text content',
    defaultProperties: {
      text: 'Hello World',
      fontSize: 16,
      color: '#000000',
      fontWeight: 'normal',
      textAlign: 'left',
      width: 120,
      height: 35,
    }
  },
  {
    id: 'button',
    name: 'ElevatedButton',
    category: 'Input',
    icon: 'RectangleHorizontal',
    hasChildren: false,
    description: 'A material design elevated button',
    defaultProperties: {
      text: 'Button',
      backgroundColor: '#007AFF',
      textColor: '#FFFFFF',
      fontSize: 16,
      padding: 16,
      borderRadius: 8,
      width: 140,
      height: 45,
    }
  },
  {
    id: 'textfield',
    name: 'TextField',
    category: 'Input',
    icon: 'RectangleEllipsis',
    hasChildren: false,
    description: 'Text input field',
    defaultProperties: {
      placeholder: 'Enter text...',
      borderColor: '#D1D1D6',
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      width: 200,
      height: 45,
    }
  },
  {
    id: 'image',
    name: 'Image',
    category: 'Media',
    icon: 'ImageIcon',
    hasChildren: false,
    description: 'Display images',
    defaultProperties: {
      src: 'https://via.placeholder.com/150',
      width: 100,
      height: 100,
      fit: 'cover',
    }
  },
  {
    id: 'appbar',
    name: 'AppBar',
    category: 'Structure',
    icon: 'Navigation2',
    hasChildren: false,
    description: 'Application bar with title and actions',
    defaultProperties: {
      title: 'App Title',
      backgroundColor: '#2196F3',
      titleColor: '#FFFFFF',
      elevation: 4,
      showBackButton: false,
      showMenuButton: true,
      actions: [],
      centerTitle: true,
      width: '100%',
      height: 56,
    }
  },
  {
    id: 'checkbox',
    name: 'Checkbox',
    category: 'Input',
    icon: 'CheckSquare',
    hasChildren: false,
    description: 'Checkbox input',
    defaultProperties: {
      value: false,
      label: 'Checkbox',
      activeColor: '#2196F3',
      width: 200,
      height: 30,
    }
  },
  {
    id: 'radio',
    name: 'Radio',
    category: 'Input',
    icon: 'Circle',
    hasChildren: false,
    description: 'Radio button input',
    defaultProperties: {
      value: false,
      label: 'Radio Option',
      activeColor: '#2196F3',
      width: 250,
      height: 30,
    }
  },
  {
    id: 'switch',
    name: 'Switch',
    category: 'Input',
    icon: 'ToggleLeft',
    hasChildren: false,
    description: 'Toggle switch',
    defaultProperties: {
      value: false,
      activeColor: '#2196F3',
      inactiveColor: '#CCCCCC',
      width: 80,
      height: 35,
    }
  },
  {
    id: 'slider',
    name: 'Slider',
    category: 'Input',
    icon: 'Minus',
    hasChildren: false,
    description: 'Range slider input',
    defaultProperties: {
      value: 50,
      min: 0,
      max: 100,
      activeColor: '#2196F3',
      width: 250,
      height: 30,
    }
  },
  {
    id: 'icon',
    name: 'Icon',
    category: 'Basic',
    icon: 'Star',
    hasChildren: false,
    description: 'Display icons',
    defaultProperties: {
      iconName: 'star',
      size: 24,
      color: '#000000',
      width: 50,
      height: 50,
    }
  },
  {
    id: 'divider',
    name: 'Divider',
    category: 'Layout',
    icon: 'Separator',
    hasChildren: false,
    description: 'Horizontal or vertical divider',
    defaultProperties: {
      orientation: 'horizontal',
      thickness: 1,
      color: '#E0E0E0',
      width: 200,
      height: 1,
    }
  },
  {
    id: 'progress',
    name: 'ProgressBar',
    category: 'Feedback',
    icon: 'Loader',
    hasChildren: false,
    description: 'Linear progress indicator',
    defaultProperties: {
      value: 0.5,
      backgroundColor: '#E0E0E0',
      valueColor: '#2196F3',
      width: 250,
      height: 12,
    }
  },
  {
    id: 'chip',
    name: 'Chip',
    category: 'Display',
    icon: 'Tag',
    hasChildren: false,
    description: 'Compact element for tags or labels',
    defaultProperties: {
      label: 'Chip',
      backgroundColor: '#E0E0E0',
      textColor: '#000000',
      deleteIcon: false,
      width: 120,
      height: 36,
    }
  },
  {
    id: 'bottomnavbar',
    name: 'BottomNavigationBar',
    category: 'Structure',
    icon: 'Navigation',
    hasChildren: false,
    description: 'Bottom navigation bar with tabs',
    defaultProperties: {
      backgroundColor: '#FFFFFF',
      selectedColor: '#2196F3',
      unselectedColor: '#757575',
      selectedIndex: 0,
      items: ['Home', 'Search', 'Profile'],
      icons: ['Home', 'Search', 'User'],
      routes: ['/', '/search', '/profile'],
      showLabels: true,
      type: 'fixed',
      elevation: 8,
      width: '100%',
      height: 56,
    }
  },
  {
    id: 'checklist',
    name: 'CheckList',
    category: 'Input',
    icon: 'CheckSquare2',
    hasChildren: false,
    description: 'List of checkable items',
    defaultProperties: {
      items: ['Task 1', 'Task 2', 'Task 3'],
      checkedItems: [0],
      itemColor: '#000000',
      checkedColor: '#2196F3',
      uncheckedColor: '#757575',
      fontSize: 14,
      spacing: 8,
      width: 300,
      height: 150,
    }
  },
  {
    id: 'table',
    name: 'Table',
    category: 'Display',
    icon: 'Table',
    hasChildren: false,
    description: 'Data table with rows and columns',
    defaultProperties: {
      columns: ['Name', 'Age', 'City'],
      rows: [
        ['John Doe', '25', 'New York'],
        ['Jane Smith', '30', 'Los Angeles'],
        ['Bob Johnson', '35', 'Chicago']
      ],
      headerColor: '#2196F3',
      headerTextColor: '#FFFFFF',
      rowColor: '#FFFFFF',
      alternateRowColor: '#F5F5F5',
      textColor: '#000000',
      borderColor: '#E0E0E0',
      fontSize: 14,
      padding: 8,
      showBorders: true,
      width: '100%',
      height: 200,
    }
  },
  {
    id: 'listview',
    name: 'ListView',
    category: 'Scrolling',
    icon: 'List',
    hasChildren: true,
    description: 'Scrollable list of widgets',
    defaultProperties: {
      scrollDirection: 'vertical',
      itemCount: 5,
      padding: 8,
      width: 280,
      height: 320,
    }
  },
  {
    id: 'dropdown',
    name: 'Dropdown',
    category: 'Input',
    icon: 'ChevronDown',
    hasChildren: false,
    description: 'Dropdown selection menu',
    defaultProperties: {
      items: ['Option 1', 'Option 2', 'Option 3'],
      value: '',
      placeholder: 'Select an option',
      backgroundColor: '#FFFFFF',
      borderColor: '#CCCCCC',
      textColor: '#000000',
      hoverColor: '#F5F5F5',
      arrowColor: '#757575',
      fontSize: 14,
      borderRadius: 4,
      borderWidth: 1,
      elevation: 2,
      width: 200,
      height: 40
    }
  }
];

export const DEVICE_TYPES: DeviceType[] = [
  {
    id: 'iphone_14',
    name: 'iPhone 14',
    width: 390,
    height: 844,
    pixelRatio: 3,
    icon: 'Smartphone'
  },
  {
    id: 'iphone_14_pro',
    name: 'iPhone 14 Pro',
    width: 393,
    height: 852,
    pixelRatio: 3,
    icon: 'Smartphone'
  },
  {
    id: 'ipad',
    name: 'iPad',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    icon: 'Tablet'
  },
  {
    id: 'pixel_7',
    name: 'Pixel 7',
    width: 412,
    height: 915,
    pixelRatio: 2.625,
    icon: 'Smartphone'
  },
  {
    id: 'galaxy_s23',
    name: 'Galaxy S23',
    width: 360,
    height: 780,
    pixelRatio: 3,
    icon: 'Smartphone'
  },
  {
    id: 'desktop',
    name: 'Desktop',
    width: 1200,
    height: 800,
    pixelRatio: 1,
    icon: 'Monitor'
  }
];

export const WIDGET_CATEGORIES = [
  'All',
  'Basic',
  'Layout', 
  'Input',
  'Media',
  'Structure',
  'Scrolling',
  'Feedback',
  'Display'
];
