import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import { Application, Lease, Manager, Payment, Property, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { FiltersState } from ".";
import { number } from "zod";
import { result } from "lodash";


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
  tagTypes: ["Tenants", "Managers", "Properties", "PropertyDetails", "Applications", "Leases"],
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
    getProperties: build.query<Property[], Partial<FiltersState> & { favoritesIds?: number[] }>({
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
    }),
    getUserLeases: build.query<LeaseWithPayments[], void>({
      query: () => `/leases/leasesUser`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Leases" as const, id })),
            { type: "Leases", id: "LIST" },
          ]
          : [{ type: "Leases", id: "LIST" }],
      transformResponse: (response: { userLeases: Lease[] }) => response.userLeases,
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao carregar contratos.",
          });
        } catch {

        }
      }
    }),
    getCurrentResidences: build.query<Property[], string>({
      query: (cognitoId) => `/tenants/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: "Properties" as const, id })),
            { type: "Leases", id: "LIST" },
          ]
          : [{ type: "Leases", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao carregar contratos.",
          });
        } catch {

        }
      }

    }),
    getLeasePayments: build.query<Payment[], number>({
      query: (leaseId) => `/leases/${leaseId}/payments`,
      providesTags: (result, error, id) => [{ type: "Leases", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Failed to load lease payments.",
          });
        } catch {

        }
      }
    }),
    getManagerProperties: build.query<Property[], string>({
      query: (managerId) => `/managers/${managerId}/properties`,
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

        }
      },

    }),
    getPropertyLeases: build.query<Lease[], number>({
      query: (propertyId) => `/properties/${propertyId}/leases`,
      providesTags: (result, error, id) => [{ type: "Leases", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao procurar propriedades.",
          });
        } catch {

        }
      },
    }),
    createProperty: build.mutation<Property, FormData>({
      query: (newProperty) => ({
        method: "POST",
        url: `properties`,
        body: newProperty
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao procurar propriedades.",
          });
        } catch {

        }
      },

    }),
    getApplications: build.query<Application[], { userId?: string, userRole?: string }>({
      query: ({ userId, userRole }) => {
        const queryParams = new URLSearchParams()

        if (userId) {
          queryParams.append("userId", userId.toString())
        }

        if (userRole) {
          queryParams.append("userRole", userRole)
        }

        return `applications?${queryParams.toString()}`

      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao procurar propriedades.",
          });
        } catch {

        }
      },
    }),
    updateApplicationStatus: build.mutation<Application & { lease?: Lease }, { applicationId: string, status: string }>({
      query: ({ applicationId, status }) => ({
        method: "PUT",
        url: `applications/${applicationId}/status`,
        body: { status }
      }),
      invalidatesTags: ["Applications", "Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await withToast(queryFulfilled, {
            error: "Falha ao procurar propriedades.",
          });
        } catch {

        }
      },
    })




  })
});

export const {
  useGetAuthUserQuery,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemovePropertyMutation,
  useGetPropertyQuery,
  useCreateApplicationMutation,
  useGetUserLeasesQuery,
  useGetCurrentResidencesQuery,
  useGetLeasePaymentsQuery,
  useGetManagerPropertiesQuery,
  useGetPropertyLeasesQuery,
  useCreatePropertyMutation,
  useUpdateApplicationStatusMutation,
  useGetApplicationsQuery
} = api;
