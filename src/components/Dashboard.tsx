'use client';

import { useEffect } from 'react';
import { useAnalyticsEvents } from './providers/AnalyticsEventsProvider'; // Adjust path as needed
import EventCard from './EventCard'; // Adjust path as needed

function Dashboard() {
  const { events, loading, error, updateDateRange, rates, insc } = useAnalyticsEvents();

  useEffect(() => {
    updateDateRange('7daysAgo');
  }, []);

  if (loading) {
    return (
      <main className="bg-secondary-blue p-6 rounded-lg h-[30rem] flex justify-center items-center flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main-blue mx-auto mb-4"></div>
        <p className="text-main-blue font-medium">Chargements de données...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-secondary-blue p-6 rounded-lg h-[30rem]">
        <h1 className="text-3xl text-white font-bold">Taux de conversion</h1>
        <div className="text-red-400 mt-4">Error: {error}</div>
      </main>
    );
  }

  return (
    <main className="bg-secondary-blue p-6 rounded-lg overflow-auto h-fit space-y-10">
      {/* 1. Events Section */}
      <section className='w-full max-w-[100rem]'>
        <h1 className="text-5xl text-white font-bold mb-6">Nombres d'événements</h1>
          <div id="events_cards" className="flex flex-wrap gap-6 md:gap-x-0 md:gap-y-6">
            {events.map((event, index) => (
              <div key={event.eventName} className="md:flex items-center">
                <EventCard
                  key={index}
                  eventName={event.eventName}
                  eventCount={event.eventCount}
                  variationRate={event.variationRate}
                />
                {index < events.length - 1 && <img src="/Arrow.png/" className="hidden md:block" alt="arrow" />}
              </div>
            ))}
        </div>
      </section>

      {/* 2. Rates Section */}
      <section className='w-full max-w-[100rem]'>
        <h1 className="text-5xl text-white font-bold mb-6">Taux de conversion</h1>
        <div className="flex flex-wrap gap-6">
          {rates.map((rate, i) => (
            <EventCard
                key={i}
                eventName={rate.name}
                eventCount={Math.round(rate.rate)+"%"}
                variationRate={rate.variation}
            />
          ))}
        </div>
      </section>

      {/* 3. Taux d’inscription */}
      {insc !== null && (
        <section className='w-full max-w-[80rem]'>
          <h1 className="text-5xl text-white font-bold mb-6">Taux d’inscription</h1>
          <EventCard
            eventName={insc.name}
            eventCount={Math.round(insc.rate)+"%"}
            variationRate={insc.variation}
           />
        </section>
      )}
    </main>
  );
}

export default Dashboard;
