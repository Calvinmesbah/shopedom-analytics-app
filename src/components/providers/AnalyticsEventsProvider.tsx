/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { TransformedEventData } from '@/types/EventData';
import { TransformedRateData } from '@/types/RateData';

type AnalyticsEventsContextType = {
  events: TransformedEventData[];
  rates: TransformedRateData[];
  insc:  TransformedRateData | null;
  dateRange: string;
  loading: boolean;
  error: string | null;
  updateDateRange: (newRange: string) => Promise<void>;
};

const AnalyticsEventsContext = createContext<AnalyticsEventsContextType | undefined>(undefined);

export const AnalyticsEventsProvider = ({
  initialEvents,
  initialDateRange,
  children,
}: {
  initialEvents: TransformedEventData[];
  initialDateRange: string;
  children: ReactNode;
}) => {
  const [events, setEvents] = useState<TransformedEventData[]>(initialEvents);
  const [rates, setRates] = useState<TransformedRateData[]>([]);
  const [insc, setInsc] = useState<TransformedRateData | null>(null);
  const [dateRange, setDateRange] = useState<string>(initialDateRange);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (range: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events?dateRange=${encodeURIComponent(range)}`);
      if (!res.ok) throw new Error('Failed to fetch analytics events');
      const data:{events:TransformedEventData[], rates:TransformedRateData[], insc:TransformedRateData} = await res.json();

      // Remove 'sign_up' event from events list
      const visibleEvents = data.events.filter((e: TransformedEventData) => e.eventName !== 'sign_up');

      setEvents(visibleEvents);
      // Expecting data.rates as [{name, rate, variationRate}, ...]
      setRates(data.rates || []);
      // insc is a number, e.g. 0.1234
      setInsc(data.insc ?? null);
      setDateRange(range);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialEvents.length === 0) {
      fetchEvents(initialDateRange);
    }
  }, []);

  const updateDateRange = async (newRange: string) => {
    await fetchEvents(newRange);
  };

  return (
    <AnalyticsEventsContext.Provider
      value={{ events, rates, insc, dateRange, loading, error, updateDateRange }}
    >
      {children}
    </AnalyticsEventsContext.Provider>
  );
};

export const useAnalyticsEvents = (): AnalyticsEventsContextType => {
  const context = useContext(AnalyticsEventsContext);
  if (!context) {
    throw new Error('useAnalyticsEvents must be used within an AnalyticsEventsProvider');
  }
  return context;
};
