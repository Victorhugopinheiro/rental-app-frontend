import { Button } from "@/components/ui/button";
import { BookText, CardSim, CreditCard, Download, Edit, LocationEdit, Mail, PiIcon } from "lucide-react"

export default function PaymentMethodComponent() {
    return (
        <div className="flex p-6 flex-col lg:max-w-4/12 shadow rounded-xl bg-white items-center  h-full w-full">
            <div className="w-full">

                <h1 className="text-xl font-bold  py-2">Forma de pagamento</h1>

                <p className="py-2">Mude sua forma de pagamento</p>

                <div className="p-4 flex flex-col border  border-slate-300 rounded-lg gap-2">

                    <div className="flex justify-between ">
                        <CreditCard className="w-20 h-20 text-slate-600" />

                        <div className="flex flex-col ">


                            <span className="font-bold text-xl">Cartão de crédito</span>

                            <Button className="text-slate-500 flex gap-1">
                                <BookText width={4} height={4} />
                                Expira * 26/06/2026
                            </Button>

                            <Button className="text-slate-500 flex gap-1">
                                <Mail width={4} height={4} />
                                Victor@gmail.com
                            </Button>

                        </div>

                        <Button variant="outline" className="h-8 self-start">
                            Alterar
                        </Button>
                    </div>

                    <div className="flex w-full items-center justify-end border-t border-t-slate-300 mt-4">
                        <Button variant="ghost" className="mt-4 border border-slate-300    flex  gap-2">
                            <Edit className="w-4 h-4" />
                            Editar
                        </Button>
                    </div>

                </div>

            </div>

        </div>
    );
}