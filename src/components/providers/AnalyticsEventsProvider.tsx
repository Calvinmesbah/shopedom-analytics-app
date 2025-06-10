"use client";
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { TransformedEventData } from '@/types/EventData';

type RateItem = {
  name: string;
  rate: number;
  variation: string;
};

type AnalyticsEventsContextType = {
  events: TransformedEventData[];
  rates: RateItem[];
  insc:  RateItem | null;
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
  const [rates, setRates] = useState<RateItem[]>([]);
  const [insc, setInsc] = useState<RateItem | null>(null);
  const [dateRange, setDateRange] = useState<string>(initialDateRange);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (range: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/events?dateRange=${encodeURIComponent(range)}`);
      if (!res.ok) throw new Error('Failed to fetch analytics events');
      const data:{events:any, rates:any, insc:any} = await res.json();

      // Remove 'sign_up' event from events list
      const visibleEvents = data.events.filter((e: any) => e.eventName !== 'sign_up');

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
