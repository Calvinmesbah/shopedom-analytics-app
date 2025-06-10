import { TransformedEventData } from "@/types/EventData";

function EventCard({ eventName, eventCount, variationRate }: TransformedEventData) {
    // Format event name for display
    const formatEventName = (name: string) => {
        return name
    };

    const isNegative = variationRate.trim().startsWith('-');
    const variationClass = isNegative
        ? 'text-red-600 bg-red-100 border-red-200'
        : 'text-green-600 bg-green-100 border-green-200';

    const formattedVariation = isNegative
        ? variationRate
        : `+${variationRate}`;

    return (
        <div className="rounded-xl p-4 bg-gray-background border-2 border-main-blue w-full md:w-[20rem] h-fit">
            <div className="flex justify-between items-start mb-4">
                <div className="flex justify-between gap-2 w-full">
                    <h2 className="text-2xl font-semibold text-main-blue">
                        {formatEventName(eventName)}
                    </h2>
                    <div
                        className={`border text-sm p-1 px-2 rounded-lg font-bold w-fit h-fit ${variationClass}`}
                    >
                        {formattedVariation}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex justify-between items-center">
                    <h3 className="text-5xl font-bold text-gray-text">
                        {eventCount.toLocaleString()}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default EventCard;
