"use client"

import { NAVBAR_HEIGHT } from "@/lib/constants";
import LeasesComponent from "../_components/leasesComponent";
import PaymentMethodComponent from "../_components/paymentMethod";
import { useGetAuthUserQuery, useGetLeasePaymentsQuery, useGetUserLeasesQuery } from "@/state/api";
import BillingHistory from "../_components/billingHistory";
import { useParams } from "next/navigation";


export default function Residenceid() {

    const params = useParams();
    const propertyId = Number(params.id);

    const { data: authUser, isError, isLoading } = useGetAuthUserQuery();


    const { data: leasesUser } = useGetUserLeasesQuery(undefined, {
        skip: !authUser?.cognitoInfo.userId
    });

    const currentLease = leasesUser?.find(lease => lease.propertyId === propertyId);


    const payments = currentLease?.payments || [];




    return (
        <div
            style={{ height: `calc(100vh - 40px)` }}
            className={`flex flex-col  bg-slate-200 
                items-center  justify-center py-2  w-full 
               
                `}>
            <div className="flex flex-col items-center   h-full w-full gap-6 m-4 p-6">
                <div className="flex justify-center gap-10  w-full  lg:flex-row">
                    <LeasesComponent lease={leasesUser} />
                    <PaymentMethodComponent />
                </div>


                <div className="w-full max-w-10/12">
                    <BillingHistory payments={payments} />
                </div>

            </div>


        </div>
    )
}