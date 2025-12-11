const PopularRouteCard = ({ route }) => {
    return (
        <div className="p-5 bg-white shadow-lg rounded-xl border border-teal-500 hover:shadow-xl transition">
            <img
                src={route.image}
                alt={route.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
            />

            <h2 className="text-xl font-bold mb-1">{route.title}</h2>

            <p className="text-gray-600 mb-2">
                {route.from} → {route.to}
            </p>

            <p className="text-lg font-semibold text-primary">
                ৳{route.price}
            </p>
        </div>
    );
};

export default PopularRouteCard;
