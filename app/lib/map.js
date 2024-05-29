'use client';
import React, { useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import '../ui/map.css';
import Image from 'next/image'

const Map = ({ image, pointsOfInterest }) => {
  const [points, setPoints] = useState(pointsOfInterest || []);

  return (
    <div className="map-container">
      <TransformWrapper>
        <TransformComponent>
          <div className="map-image-container">
            <Image src={image} alt="Map" className="map-image" width={300} height={300}/>
            {points.map((point, index) => (
              <div
                key={index}
                className="map-point"
                style={{ left: point.x, top: point.y }}
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Point of Interest at (${point.x}, ${point.y})`);
                }}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default Map;
