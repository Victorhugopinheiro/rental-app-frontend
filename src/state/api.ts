import { createNewUserInDatabase } from "@/lib/utils";
import { Manager, Tenant } from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';


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
  tagTypes: ["Tenants", "Managers"],
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

          // if user doesn't exist, create new user
          if (
            userDetailsResponse.error &&
            userDetailsResponse.error.status === 404
          ) {
            console.log("[api] User not found. Creating new record...");
            userDetailsResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              fetchWithBQ
            );
            console.log("[api] User created", userDetailsResponse);
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
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id}],


    }),
  })
});

export const { useGetAuthUserQuery } = api;
