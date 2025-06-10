'use client';

import Logo from './Logo';
import { useState } from 'react';
import { useAnalyticsEvents } from './providers/AnalyticsEventsProvider'; // Adjust path

function Header() {
  const [selectedService, setSelectedService] = useState('90J');
  const { updateDateRange } = useAnalyticsEvents();

  const services = [
    { id: '90J', label: '90J', type: 'text' },
    { id: '30J', label: '30J', type: 'text' },
    { id: '7J', label: '7J', type: 'text' },
    { id: '24H', label: '24H', type: 'text' },
  ];

  // Map your UI IDs to actual dateRange strings your API expects
  const dateRangeMap: Record<string, string> = {
    '90J': '90daysAgo',
    '30J': '30daysAgo',
    '7J': '7daysAgo',
    '24H': '24hours',
  };

  const handleServiceClick = (id: string) => {
    setSelectedService(id);
    updateDateRange(dateRangeMap[id]);
  };

  return (
    <header>
      <nav className="bg-main-blue p-4 rounded-lg flex justify-between items-center">
        <Logo size={250} />
        <div
          className="flex items-center space-x-3"
          role="radiogroup"
          aria-label="Service options"
        >
          {services.map((service) => (
            <button
              key={service.id}
              role="radio"
              aria-checked={selectedService === service.id}
              onClick={() => handleServiceClick(service.id)}
              className={`
                backdrop-blur-sm font-bold border rounded-lg w-10 aspect-square text-sm transition-all duration-200 cursor-pointer
                ${
                  selectedService === service.id
                    ? 'bg-white text-blue-900 border-white shadow-lg'
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                }
              `}
            >
              {service.type === 'icon' ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              ) : (
                service.label
              )}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

export default Header;
