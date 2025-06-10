'use client';

import { useEffect } from 'react';
import { useAnalyticsEvents } from './providers/AnalyticsEventsProvider'; // Adjust path as needed
import EventCard from './EventCard'; // Adjust path as needed

function Dashboard() {
  const { events, loading, error, rates, insc } = useAnalyticsEvents();

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
      <section className="w-full max-w-[100rem]">
        <h1 className="text-4xl text-white font-bold mb-6">Nombres d&apos;événements</h1>
        <div id="events_cards" className="grid grid-cols-1 md:flex flex-wrap gap-6 md:gap-x-0 md:gap-y-6">
          {events.map((event, index) => (
            <div key={event.eventName} className="flex flex-col md:flex md:flex-row items-center">
              <EventCard
                key={index}
                info={event.info}
                eventName={event.eventName}
                eventCount={event.eventCount}
                variationRate={event.variationRate}
              />
              {index < events.length - 1 && <img src="/Arrow.png/" className="block rotate-90 md:rotate-0" alt="arrow" />}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Rates Section */}
      <section className="w-full max-w-[100rem]">
        <h1 className="text-4xl text-white font-bold mb-6">Taux de conversion</h1>
        <div className="flex flex-wrap gap-6">
          {rates.map((rate, i) => (
            <EventCard
              key={i}
              info={rate.info}
              eventName={rate.name}
              eventCount={parseFloat(rate.rate.toFixed(2)) + '%'}
              variationRate={rate.variation}
            />
          ))}
        </div>
      </section>

      {/* 3. Taux d’inscription */}
      {insc !== null && (
        <section className="w-full max-w-[80rem]">
          <h1 className="text-4xl text-white font-bold mb-6">Taux d&rsquo;inscription</h1>
          <EventCard
            eventName={insc.name}
            info={insc.info}
            eventCount={parseFloat(insc.rate.toFixed(2)) + '%'}
            variationRate={insc.variation}
          />
        </section>
      )}
    </main>
  );
}

export default Dashboard;
