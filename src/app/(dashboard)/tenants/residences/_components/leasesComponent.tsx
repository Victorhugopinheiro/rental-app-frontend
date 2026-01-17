import { Button } from "@/components/ui/button";
import { Lease } from "@/types/prismaTypes";
import { Download, LocationEdit, PiIcon } from "lucide-react"

export default function LeasesComponent({ lease }: { lease?: Lease }) {
    return (
        <div className="flex w-full p-6 flex-col lg:max-w-4/12 shadow rounded-xl bg-white items-center justify-center h-full ">
            <div className="w-full">



                <div className="flex gap-3 border-b border-b-slate-300 py-2 ">

                    <div className="w-5/12 bg-slate-600">

                    </div>

                    <div className="flex w-7/12 flex-col gap-3  py-2">
                        <span className="bg-green-400 rounded-full p-1 w-4/12 text-center text-white">Active leases</span>
                        <p className="font-bold text-xl">Apartament name</p>
                        <div className="flex gap-1 text-lg items-center">
                            <LocationEdit className="inline-block w-4 h-4 mr-2" />
                            <p>property locations, Rua x</p>
                        </div>
                        <p className="font-medium text-lg">R$1500 <span className="text-slate-400">/ Night</span></p>
                    </div>
                </div>

                <div className="flex justify-between border-b border-b-slate-300 py-4 mt-4">

                    <div className="flex flex-col w-full  border-r-slate-300 p-2">
                        <span className="font-medium">Começo do contrato</span>
                        <p>20/05/2024</p>

                    </div>

                    <div className="flex flex-col items-center w-full border-r border-l border-l-slate-300 border-r-slate-300 p-2">
                        <span className="font-medium">Final do Contrato</span>
                        <p>20/05/2025</p>

                    </div>


                    <div className="flex items-center flex-col w-full  p-2">
                        <span className="font-medium">Proximo pagamento</span>
                        <p>20/05/2026</p>

                    </div>

                </div>


                <div className="flex w-full lg:flex-col xl:flex-row justify-end gap-3">
                    <Button variant="outline" className="mt-4 w-5/12 lg:w-8/12 xl:w-5/12 flex" >
                        <PiIcon className="w-4 h-4 mr-2" />
                        Manager
                    </Button>

                    <Button variant="outline" className="mt-4 w-5/12 lg:w-8/12 xl:w-5/12 flex">
                        <Download className="w-4 h-4 mr-2" />
                        Download lease
                    </Button>
                </div>
            </div>

        </div>
    );
}