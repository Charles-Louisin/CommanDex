export interface Table {
  id: string;
  restaurantId: string;
  number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  qrCode?: string;
}

export interface TableSession {
  tableId: string;
  restaurantId: string;
  sessionStarted: string;
}

