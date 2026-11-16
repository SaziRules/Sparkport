'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Store } from '@/lib/stores';

function makeIcon(active: boolean) {
  const size = active ? 38 : 28;
  const bg = active ? '#184363' : '#009eb9';
  const ring = active ? '0 0 0 4px rgba(24,67,99,0.18)' : '0 0 0 3px rgba(0,158,185,0.18)';
  const html = `
    <div style="
      width:${size}px;height:${size}px;
      background:${bg};
      border:2px solid #ffffff;
      border-radius:9999px;
      box-shadow:${ring}, 0 4px 12px rgba(24,67,99,0.25);
      display:flex;align-items:center;justify-content:center;
      transition:all 180ms ease-out;
    ">
      <div style="width:${active ? 8 : 6}px;height:${active ? 8 : 6}px;background:#ffffff;border-radius:9999px;"></div>
    </div>`;
  return L.divIcon({
    className: '',
    html,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapController({ stores, selected }: { stores: Store[]; selected: Store | null }) {
  const map = useMap();
  // Start the "last flown to" baseline at the initial selection so we don't
  // fly on mount, even under React Strict Mode's double-effect behavior.
  const lastFlownId = useRef<string | null>(selected?.id ?? null);
  const didInitialFit = useRef(false);

  useEffect(() => {
    if (didInitialFit.current || stores.length === 0) return;
    const bounds = L.latLngBounds(stores.map((s) => [s.coordinates.lat, s.coordinates.lng]));
    map.fitBounds(bounds, { padding: [60, 60] });
    didInitialFit.current = true;
  }, [stores, map]);

  useEffect(() => {
    const id = selected?.id ?? null;
    if (id === lastFlownId.current) return;
    lastFlownId.current = id;
    if (selected?.coordinates) {
      map.flyTo([selected.coordinates.lat, selected.coordinates.lng], 15, { duration: 0.8 });
    }
  }, [selected, map]);

  return null;
}

interface Props {
  stores: Store[];
  selected: Store | null;
  onSelect: (store: Store) => void;
}

export default function StoreMap({ stores, selected, onSelect }: Props) {
  const center: [number, number] = [-29.83, 31.005];

  return (
    <MapContainer
      center={center}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        subdomains={['a', 'b', 'c']}
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <MapController stores={stores} selected={selected} />
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.coordinates.lat, store.coordinates.lng]}
          icon={makeIcon(selected?.id === store.id)}
          eventHandlers={{ click: () => onSelect(store) }}
        />
      ))}
    </MapContainer>
  );
}
