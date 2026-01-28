"use client"

import Card from '@/components/Card'
import Header from '@/components/Header'
import Loading from '@/components/loading';
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from '@/state/api';
import React from 'react'

function ManagerProperties() {

  const { data: authUser, isLoading,
    error, } = useGetAuthUserQuery();

  const { data: managerProperties } = useGetManagerPropertiesQuery(
    authUser?.cognitoInfo?.userId || "",
    {
      skip: !authUser?.cognitoInfo?.userId,
    }
  )


  if (isLoading) return <Loading />;
  if (error) return <div>Error ao carregar propriedades</div>;




  return (
    <div className="dashboard-container">
      <Header
        title="Minhas propriedades"
        subtitle="Visualize e gerencie as propriedades que voce administra"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {managerProperties?.map((property) => (
          <Card
            key={property.id}
            property={property}
            isFavorite={false}
            onFavoriteToggle={() => { }}
            showFavoriteButton={false}
            propertyLink={`/managers/properties/${property.id}`}
          />
        ))}
      </div>
      {(!managerProperties || managerProperties.length === 0) && (
        <p>Voce nao gerencia nenhuma propriedade</p>
      )}
    </div>

  )
}

export default ManagerProperties