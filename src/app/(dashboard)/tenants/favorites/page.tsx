"use client"

import Header from '@/components/Header'
import { useGetAuthUserQuery, useGetPropertiesQuery, useGetTenantQuery } from '@/state/api';
import React from 'react'
import { Tenant } from '@/types/prismaTypes';

import Loading from '@/components/loading';
import Card from '@/components/Card';
function TenantsFavorites() {

  const { data: authUser, isError, isLoading } = useGetAuthUserQuery();



  const {data: tenant} = useGetTenantQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  )as { data: Tenant | undefined; isLoading: boolean };

  const {data: favoriteProperties, isLoading:PropertiesLoading} = useGetPropertiesQuery({
    favoritesIds: tenant?.favorites?.map((propertyFavorite:{id:number}) => propertyFavorite.id),
  })


 
  if (isLoading) return <Loading />;
  if (isError) return <div>Error loading favorites</div>;


  return (
    <div className="dashboard-container">
      <Header
        title="Propriedades favoritadas"
        subtitle="Gerencie suas propriedades favoritas"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => { }}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property.id}`}
          />
        ))}
      </div>
      {(!favoriteProperties || favoriteProperties.length === 0) && (
        <p>Voce nao tem nenhuma propriedade favoritada</p>
      )}
    </div>
  )
}

export default TenantsFavorites