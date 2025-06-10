
function RateCard({rateName, rate, variant}: RateData & { variant: 'important' | 'normal' }) {
    return ( 
        <div className={`rounded-xl p-4 border-2 border-main-blue w-[15rem] h-fit ${
            variant === 'important' ? 'bg-main-yellow' : 'bg-gray-background'
        }`}>
            <div className="flex justify-between items-start">
                <div className="flex flex-col justify-between w-full gap-5">
                    <h2 className="text-xl font-semibold text-main-blue">
                        {rateName}
                    </h2>
                    <div className="text-gray-text p-1 px-2 text-2xl rounded-lg font-bold w-fit h-fit">
                        {rate}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RateCard;