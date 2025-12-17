const PopularRouteCard = ({ route }) => {
    return (
        <div className="p-5 bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-800/50 rounded-xl border border-teal-500 dark:border-teal-600 hover:shadow-xl dark:hover:shadow-teal-900/50 transition">
            <img
                src={route.image}
                alt={route.title}
                className="w-full h-30 object-cover rounded-lg mb-4"
            />

            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{route.title}</h2>

            <p className="text-gray-600 dark:text-slate-400 mb-2">
                {route.from} → {route.to}
            </p>

            <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                ৳{route.price?.toLocaleString() || route.price}
            </p>
        </div>
    );
};

export default PopularRouteCard;
