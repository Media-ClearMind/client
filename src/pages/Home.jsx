const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="fixed top-0 left-0 w-full bg-gray-200 h-2 z-[1000]">
                <div
                    className="bg-blue-600 h-2 transition-all duration-300"
                    style={{ width: `100%` }}></div>
            </div>
            <h1 className="text-2xl font-bold text-blue-600 mb-4">Welcome to Home Page</h1>
            <p className="text-gray-600">This is the main dashboard of your application.</p>
        </div>
    )
}

export default HomePage
