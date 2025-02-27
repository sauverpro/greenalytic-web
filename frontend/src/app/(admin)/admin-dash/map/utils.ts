// components/utils.ts

export interface CarPosition {
  lat: number;
  lng: number;
  timestamp: number;
}

export interface Car {
  id: number;
  owner: string;
  position: [number, number];
  history: CarPosition[];
  totalDistance: number;
}

// Calculate distance between two points in km
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Initial Car Data
export const initialCars: Car[] = [
  {
    id: 1,
    owner: "User A",
    position: [-1.9403, 30.0596],
    history: [],
    totalDistance: 0
  },
  {
    id: 2,
    owner: "User A",
    position: [-1.945, 30.061],
    history: [],
    totalDistance: 0
  },
  {
    id: 3,
    owner: "User B",
    position: [-1.95, 30.065],
    history: [],
    totalDistance: 0
  },
  {
    id: 4,
    owner: "User C",
    position: [-1.93, 30.057],
    history: [],
    totalDistance: 0
  }
];
