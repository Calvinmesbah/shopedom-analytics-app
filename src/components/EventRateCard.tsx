function EventRateCard({name, rate, count}: {name: string, rate: string, count: string}) {
    return ( 
        <div className="rounded-xl p-4 bg-gray-background border-2 border-main-blue w-[23rem] h-fit">
            <div className="flex justify-between items-start mb-2">
                <div className="flex justify-between w-full">
                    <h2 className="text-2xl font-semibold text-main-blue">
                        {name}
                    </h2>
                    <div className="border text-sm text-gray-text p-1 px-2 rounded-lg font-bold w-fit bg-white h-fit">
                        {rate}
                    </div>
                </div>
            </div>
            
            <div>
                <div className="flex justify-between items-center">
                        <h3 className="text-5xl font-bold text-gray-text">
                            {count.toLocaleString()}
                        </h3>
                    </div>
            </div>
        </div>
     );
}

export default EventRateCard;