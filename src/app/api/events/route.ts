import { NextRequest, NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const TARGET_EVENTS = [
  'page_view',
  'view_category',
  'view_item',
  'view_cart',
  'add_to_cart',
  'begin_checkout',
  'sed_view_payment_page',
  'purchase',
];

type DateRangeInfo = {
  current: { start: string; end: string };
  previous: { start: string; end: string };
};

function getDateRanges(range: string): DateRangeInfo | null {
  switch (range) {
    case '7daysAgo':
      return {
        current: { start: '7daysAgo', end: 'today' },
        previous: { start: '14daysAgo', end: '8daysAgo' },
      };
    case '30daysAgo':
      return {
        current: { start: '30daysAgo', end: 'today' },
        previous: { start: '60daysAgo', end: '31daysAgo' },
      };
    case '90daysAgo':
      return {
        current: { start: '90daysAgo', end: 'today' },
        previous: { start: '180daysAgo', end: '91daysAgo' },
      };
    case '1daysAgo':
    case '24hours':
      return {
        current: { start: '1daysAgo', end: 'today' },
        previous: { start: '2daysAgo', end: '1daysAgo' },
      };
    default:
      return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
    });

    const PROPERTY_ID = process.env.GA4_PROPERTY_ID!;
    const { searchParams } = new URL(request.url);
    const dateRangeParam = searchParams.get('dateRange') || '7daysAgo';
    const ranges = getDateRanges(dateRangeParam);

    if (!ranges) {
      return NextResponse.json(
        { error: 'Invalid dateRange. Use 7daysAgo, 30daysAgo, 90daysAgo, 1daysAgo, or 24hours' },
        { status: 400 }
      );
    }

    const getEventCounts = async (startDate: string, endDate: string) => {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'eventCount' }],
      });

      const counts: Record<string, number> = {};
      for (const row of response.rows || []) {
        const name = row.dimensionValues?.[0]?.value;
        const count = parseInt(row.metricValues?.[0]?.value || '0', 10);
        if (name && TARGET_EVENTS.includes(name)) {
          counts[name] = count;
        }
      }
      return counts;
    };

    const getUniqueEventCounts = async (startDate: string, endDate: string, events: string[]) => {
      const [response] = await analyticsDataClient.runReport({
        property: `properties/${PROPERTY_ID}`,
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'eventName' }],
        metrics: [{ name: 'activeUsers' }],
      });

      const counts: Record<string, number> = {};
      for (const row of response.rows || []) {
        const name = row.dimensionValues?.[0]?.value;
        const unique = parseInt(row.metricValues?.[0]?.value || '0', 10);
        if (name && events.includes(name)) {
          counts[name] = unique;
        }
      }
      return counts;
    };

    const currentCounts = await getEventCounts(ranges.current.start, ranges.current.end);
    const previousCounts = await getEventCounts(ranges.previous.start, ranges.previous.end);

    const currentUnique = await getUniqueEventCounts(ranges.current.start, ranges.current.end, ['sign_up', 'add_to_cart']);
    const previousUnique = await getUniqueEventCounts(ranges.previous.start, ranges.previous.end, ['sign_up', 'add_to_cart']);

    const eventNameTranslations: Record<string, string> = {
      page_view: 'Vues de page',
      view_category: 'Vues catégorie',
      view_item: 'Vues article',
      view_cart: 'Vues panier',
      add_to_cart: 'Ajouts au panier',
      begin_checkout: 'Début de commande',
      sed_view_payment_page: 'Page paiement vues',
      purchase: 'Achats',
    };

    const events = TARGET_EVENTS.map((eventName) => {
      const current = currentCounts[eventName] || 0;
      const previous = previousCounts[eventName] || 0;
      const variation = previous === 0 ? null : ((current - previous) / previous) * 100;

      return {
        eventName: eventNameTranslations[eventName] || eventName,
        eventCount: current,
        variationRate: variation !== null ? `${variation.toFixed(2)}%` : 'N/A',
      };
    });

    const rates = [
      {
        name: 'Conversion livraison',
        currentNumerator: currentCounts['sed_view_payment_page'] || 0,
        currentDenominator: currentCounts['begin_checkout'] || 0,
        previousNumerator: previousCounts['sed_view_payment_page'] || 0,
        previousDenominator: previousCounts['begin_checkout'] || 0,
      },
      {
        name: 'Conversion globale livraison',
        currentNumerator: currentCounts['sed_view_payment_page'] || 0,
        currentDenominator: currentCounts['view_cart'] || 0,
        previousNumerator: previousCounts['sed_view_payment_page'] || 0,
        previousDenominator: previousCounts['view_cart'] || 0,
      },
      {
        name: 'Paiement > achat',
        currentNumerator: currentCounts['purchase'] || 0,
        currentDenominator: currentCounts['sed_view_payment_page'] || 0,
        previousNumerator: previousCounts['purchase'] || 0,
        previousDenominator: previousCounts['sed_view_payment_page'] || 0,
      },
      {
        name: 'Conversion store',
        currentNumerator: currentCounts['purchase'] || 0,
        currentDenominator: currentCounts['view_item'] || 0,
        previousNumerator: previousCounts['purchase'] || 0,
        previousDenominator: previousCounts['view_item'] || 0,
      },
    ].map(({ name, currentNumerator, currentDenominator, previousNumerator, previousDenominator }) => {
      const currentRate = currentDenominator === 0 ? 0 : (currentNumerator / currentDenominator) * 100;
      const previousRate = previousDenominator === 0 ? 0 : (previousNumerator / previousDenominator) * 100;
      const variation = previousRate === 0 ? null : currentRate - previousRate;

      return {
        name,
        rate: currentRate,
        variation: variation !== null ? `${variation.toFixed(2)}%` : 'N/A',
      };
    });

    // Taux d’insc = sign_up (unique) / add_to_cart (unique)
    const signUpCurrent = currentUnique['sign_up'] || 0;
    const addToCartCurrent = currentUnique['add_to_cart'] || 0;
    const signUpPrevious = previousUnique['sign_up'] || 0;
    const addToCartPrevious = previousUnique['add_to_cart'] || 0;

    const currentInsc = addToCartCurrent === 0 ? 0 : (signUpCurrent / addToCartCurrent) * 100;
    const previousInsc = addToCartPrevious === 0 ? 0 : (signUpPrevious / addToCartPrevious) * 100;
    const inscVariation = previousInsc === 0 ? null : currentInsc - previousInsc;

    const insc = {
      name: 'Taux d’insc',
      rate: currentInsc,
      variation: inscVariation !== null ? `${inscVariation.toFixed(2)}%` : 'N/A',
    };

    return NextResponse.json({ events, rates, insc });
  } catch (error) {
    console.error('GA Events Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch GA events' }, { status: 500 });
  }
}
