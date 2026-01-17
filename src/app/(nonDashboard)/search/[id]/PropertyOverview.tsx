import { useGetPropertyQuery } from "@/state/api";
import { MapPin, Star } from "lucide-react";
import React from "react";

const PropertyOverview = ({ propertyId }: PropertyOverviewProps) => {
    const {
        data: property,
        isError,
        isLoading,
        error,
    } = useGetPropertyQuery(propertyId);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading property details...</div>
            </div>
        );
    }

    if (isError) {
        console.error("Error fetching property:", error);
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 my-4">
                <h3 className="text-red-800 font-semibold mb-2">Error Loading Property</h3>
                <p className="text-red-600 text-sm">
                    Property ID {propertyId} could not be loaded. Please try again later.
                </p>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-4">
                <p className="text-yellow-800">Property not found</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">
                    {property.location?.country} / {property.location?.state} /{" "}
                    <span className="font-semibold text-gray-600">
                        {property.location?.city}
                    </span>
                </div>
                <h1 className="text-3xl font-bold my-5">{property.name}</h1>
                <div className="flex justify-between items-center">
                    <span className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-1 text-gray-700" />
                        {property.location?.city}, {property.location?.state},{" "}
                        {property.location?.country}
                    </span>
                    <div className="flex justify-between items-center gap-3">
                        <span className="flex items-center text-yellow-500">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            {property.averageRating?.toFixed(1) || "N/A"} ({property.numberOfReviews || 0}{" "}
                            Reviews)
                        </span>
                        <span className="text-green-600">Verified Listing</span>
                    </div>
                </div>
            </div>

            {/* Details */}
            <div className="border border-primary-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center gap-4 px-5">
                    <div>
                        <div className="text-sm text-gray-500">Monthly Rent</div>
                        <div className="font-semibold">
                            ${property.pricePerMonth?.toLocaleString() || "N/A"}
                        </div>
                    </div>
                    <div className="border-l border-gray-300 h-10"></div>
                    <div>
                        <div className="text-sm text-gray-500">Bedrooms</div>
                        <div className="font-semibold">{property.beds || 0} bd</div>
                    </div>
                    <div className="border-l border-gray-300 h-10"></div>
                    <div>
                        <div className="text-sm text-gray-500">Bathrooms</div>
                        <div className="font-semibold">{property.baths || 0} ba</div>
                    </div>
                    <div className="border-l border-gray-300 h-10"></div>
                    <div>
                        <div className="text-sm text-gray-500">Square Feet</div>
                        <div className="font-semibold">
                            {property.squareFeet?.toLocaleString() || "N/A"} sq ft
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary */}
            <div className="my-16">
                <h2 className="text-xl font-semibold mb-5">About {property.name}</h2>
                <p className="text-gray-500 leading-7">
                    {property.description || "No description available."}
                </p>
            </div>
        </div>
    );
};

export default PropertyOverview;