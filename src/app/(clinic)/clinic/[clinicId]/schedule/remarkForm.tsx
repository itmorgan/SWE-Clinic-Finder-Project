import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { rejectAppointment } from "./action";
import { Input } from "@/components/ui/input";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Appointment } from "@prisma/client";


export default function RemarkForm(appointment){
    const [open, setOpen] = useState(false)
    const formSchema = z.object({
        remarks: z.string().min(1, {
          message: "Remarks must be at least 2 characters.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          remarks: "",
        },
    });

    function onSubmit(appointmentId: string, values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const remarks: string = values.remarks as string;
        rejectAppointment(appointmentId, remarks);
        setOpen(false)
        form.reset();
    }


    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
            <Button variant="destructive" className="">
                Cancel
            </Button>
            </DialogTrigger>
            <DialogContent className="border-4 sm:max-w-md">
            <Form {...form}>
                <form
                onSubmit={form.handleSubmit((values) =>
                    onSubmit(appointment.id, values),
                )}
                className="space-y-8"
                >
                <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-2xl">
                        Name: {appointment.appointment.user.userinfo.firstname}{" "}
                        {appointment.appointment.user.userinfo.lastname}
                        </FormLabel>
                        <FormDescription>
                        <span className="m-0 text-xl">
                            Remarks:
                        </span>
                        </FormDescription>
                        <FormControl>
                        <Input type="remarks" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <DialogFooter>
                    <div className="w-full flex justify-center">
                        <Button 
                            variant="outline"
                            type="submit">
                            Confirm Cancellation
                        </Button>
                    </div>
                </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
    )
        
}