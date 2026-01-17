import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import { Application, Manager, Property, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { FiltersState } from ".";
import { number } from "zod";


export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};

        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }
      } catch (error) {
        console.log("No auth session available");
      }
      return headers;
    }


  }),
  reducerPath: "api",
  tagTypes: ["Tenants", "Managers", "Properties", "PropertyDetails", "Applications"],
  endpoints: (build) => ({

    getAuthUser: build.query<User, void>({
      queryFn: async (_, queryApi, _extraOptions, fetchWithBQ) => {
        console.log("[api] getAuthUser query invoked");

        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};

          if (!session || !idToken) {
            console.warn("[api] getAuthUser: no valid Cognito session");
            return {
              error: {
                status: 401,
                data: "No authenticated Cognito session",
              },
            };
          }

          const user = await getCurrentUser();
          const userRole = idToken?.payload["custom:role"] as string;

          const endpoint =
            userRole === "manager"
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          console.log("[api] Fetching user profile at", endpoint);
          let userDetailsResponse = await fetchWithBQ(endpoint);
          console.log("[api] Backend response", userDetailsResponse);

          if (userDetailsResponse.error) {
            // if user doesn't exist, create new user
            if (userDetailsResponse.error.status === 404) {
              console.log("[api] User not found. Creating new record...");
              userDetailsResponse = await createNewUserInDatabase(
                user,
                idToken,
                userRole,
                fetchWithBQ
              );
              console.log("[api] User created", userDetailsResponse);
            } else {
              // e.g. backend down (ERR_CONNECTION_REFUSED)
              return { error: userDetailsResponse.error } as any;
            }
          }

          console.log("[api] getAuthUser success");
          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailsResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: any) {
          console.error("[api] getAuthUser failure", error);
          return { error: error.message || "Could not fetch user data" };
        }

      }
    }),
    updateTenantSettings: build.mutation<Tenant, { cognitoId: string } & Partial<Tenant>>({
      query: ({ cognitoId, ...updatedTenant }) => ({
        method: "PUT",
        url: `tenants/${cognitoId}`,
        body: { updatedTenant }
      }),



    }),
    updateManagerSettings: build.mutation<Manager, { cognitoId: string } & Partial<Manager>>({
      query: ({ cognitoId, ...updatedManager }) => ({
        method: "PUT",
        url: `managers/${cognitoId}`,
        body: { updatedManager }
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }],


    }),
    getProperies: build.query<Property[], Partial<FiltersState> & { favoritesIds?: number[] }>({
      query: (filters) => {


        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoritesIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0]
        })

        return { url: "properties", params }
      },
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Properties" as const, id })),
            { type: "Properties", id: "LIST" },
          ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao procurar propriedades.",
          });
        } catch {
          // toast já foi exibido; evita unhandled promise no console
        }
      },

    }),
    getTenant: build.query<Tenant, string>({
      query: (cognitoId) => `/tenants/${cognitoId}`,
      providesTags: (result, error, id) => [{ type: "Tenants", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Failed to load tenant profile.",
          });
        } catch {
          // toast já foi exibido; evita unhandled promise no console
        }
      },
    }),
    addFavoriteProperty: build.mutation<Tenant, { cognitoId: string; propertyId: number }>({
      query: ({ cognitoId, propertyId }) => ({
        method: "POST",
        url: `tenants/${cognitoId}/add-favorite-property/${propertyId}`,
      }),

      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            success: "Added to favorites!!",
            error: "Failed to add to favorites",
          });
        } catch {
          // toast já foi exibido; evita unhandled promise no console
        }
      }
    }),
    removeProperty: build.mutation<Tenant, { cognitoId: string, propertyId: number }>({
      query: ({ cognitoId, propertyId }) => ({
        method: "DELETE",
        url: `tenants/${cognitoId}/remove-favorite-property/${propertyId}`,
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" }
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            success: "Added to favorites!!",
            error: "Failed to add to favorites",
          });
        } catch {
          // toast já foi exibido; evita unhandled promise no console
        }
      }
    }),
    getProperty: build.query<Property, number>({
      query: (id) => `/properties/${id}`,
      providesTags: (result, error, id) => [{ type: "PropertyDetails", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            success: "Added to favorites!!",
            error: "Failed to add to favorites",
          });
        } catch {

        }
      }
    }),
    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        method: "POST",
        url: `applications`,
        body
      }),
      invalidatesTags: [{ type: "Applications" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            success: "Added to favorites!!",
            error: "Failed to add to favorites",
          });
        } catch {

        }
      }
    })




  })
});

export const { useGetAuthUserQuery, useGetProperiesQuery, useGetTenantQuery,
  useAddFavoritePropertyMutation, useRemovePropertyMutation, useGetPropertyQuery, useCreateApplicationMutation } = api;
