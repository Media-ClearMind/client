import cn from '@/utils/formatter/cn'

const DdayCounter = ({ dDay, myGoal }) => {
    return (
        <div
            className={cn(
                'bg-gray-100 p-4 rounded shadow text-left my-6', // 상단과 하단에 여백 추가
                'flex flex-row items-center justify-left gap-4',
                'w-65 h-14'
            )}>
            <h1 className="text-2xl font-bold text-blue-500">D-{dDay}</h1>
            <p className="text-xl font-semibold text-gray-500">{myGoal}</p>
        </div>
    )
}

export default DdayCounter
