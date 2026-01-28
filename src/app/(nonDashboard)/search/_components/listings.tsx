
import Card from "@/components/Card";
import CardCompact from "@/components/CardCompacted";
import { useAddFavoritePropertyMutation, useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery, useRemovePropertyMutation } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { Property } from "@/types/prismaTypes";


export default function Listings() {
    const { data: authUser } = useGetAuthUserQuery()

    const cognitoId = authUser?.cognitoInfo?.userId
    const isTenant = authUser?.userRole?.toLowerCase() === "tenant"

    const { data: tenant } = useGetTenantQuery(cognitoId || "", {
        skip: !cognitoId || !isTenant
    });
    const filters = useAppSelector((state) => state.global.filters)
    const viewMode = useAppSelector((state) => state.global.viewMode)
    const [removeFavorite] = useRemovePropertyMutation()
    const [addFavorite] = useAddFavoritePropertyMutation()
    const { data: properties } = useGetPropertiesQuery(filters)



    const handleFavoriteToggle = async (propertyId: number) => {
     

    
        if (!propertyId) return;
        if (!isTenant || !cognitoId) return;


        const isFavorited = tenant?.favorites?.some((fav: Property) => fav.id === propertyId);


      

        if (isFavorited) {
            await removeFavorite({ cognitoId, propertyId })

        } else {
            await addFavorite({ cognitoId, propertyId })

        }

    }

    return (
        <div className="w-full">
            <h3 className="text-sm px-4 font-bold">
                {properties?.length}{" "}
                <span className="text-gray-700 font-normal">
                    Places in {filters.location}
                </span>
            </h3>

            <div className="flex">

                <div className="p-4 w-full">
                    {properties?.length !== 0 && properties?.map((property, index) =>
                        viewMode === "grid" ? (
                            <Card key={index}
                                isFavorite={tenant?.favorites?.some((fav: Property) => fav.id === property.id)}
                                property={property}
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                propertyLink={`/search/${property.id}`}
                                showFavoriteButton={true}
                            />
                        ) : (
                            <CardCompact
                                isFavorite={tenant?.favorites?.some((fav: Property) => fav.id === property.id)}
                                key={index}
                                property={property}
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                propertyLink={`/search/${property.id}`}
                                showFavoriteButton={true}
                            />
                        )

                    )}

                </div>

            </div>

        </div>
    )
}