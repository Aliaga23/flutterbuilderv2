// Types for Flutter widgets and app structure
export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface FlutterWidget {
  id: string;
  type: string;
  name: string;
  position: Position;
  size: Size;
  properties: Record<string, any>;
  children?: FlutterWidget[];
  parentId?: string;
}

export interface DeviceType {
  id: string;
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  icon: string;
}

export interface Page {
  id: string;
  name: string;
  widgets: FlutterWidget[];
  route: string;
}

export interface FlutterProject {
  name: string;
  description: string;
  pages: Page[];
  currentPageId: string;
  selectedDeviceId: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };
}

export interface WidgetTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  defaultProperties: Record<string, any>;
  hasChildren: boolean;
  description: string;
}

export interface DragItem {
  type: string;
  widgetType?: string;
  widget?: FlutterWidget;
}

export interface DropResult {
  position: Position;
  pageId: string;
  parentId?: string;
}
