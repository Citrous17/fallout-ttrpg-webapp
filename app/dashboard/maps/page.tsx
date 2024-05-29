import React from 'react';
import Map from '@/app/lib/map';

const pointsOfInterest = [
  // Example points of interest
  { x: 100, y: 150 },
  { x: 200, y: 250 },
];

export default function Page() {
  const mapImage = '/maps/me3.png';

    return (
      <>
        <h1 className="text-2xl font-semibold mb-6">Interactable Map</h1>
        <Map image={mapImage} pointsOfInterest={pointsOfInterest} />
      </>
    );
  }