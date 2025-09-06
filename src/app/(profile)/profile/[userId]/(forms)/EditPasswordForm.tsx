import { EditPasswordValues, editPasswordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { checkPassword, editUserInfo } from "../actions";
import { useState } from "react";
import LoadingButton from "@/components/LoadingButton";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/FormError";

export function EditPasswordForm({userId}){
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const form = useForm<EditPasswordValues>({
        resolver:zodResolver(editPasswordSchema)
    })

    const{
        handleSubmit,
        control,
        formState:{isSubmitting}
    } = form

    async function onSubmit(values: EditPasswordValues) {
       const passwordValid = await checkPassword(userId,values.currentPassword)

        if (passwordValid) {
            const temp = await editUserInfo(values, userId, "password")
            if(temp){
                setSuccessMessage("Update successful!") 
                setErrorMessage('')
            }
        }else {
            setErrorMessage('Incorrect current password');
            setSuccessMessage("") 
        }
        
    }
    

    return(
        <Form {...form}>
            <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}>
                <FormField
                    control={control}
                    name="currentPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="e.g ඞ" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="e.g ඞ" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                    <FormField
                    control={control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="e.g ඞ" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                {successMessage && (
                    <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
                )}
                {errorMessage && 
                    <div className="mt-1">
                        <FormError message={`${errorMessage}`} />
                    </div>
                }
                <div className="mt-[2vh]">
                    <LoadingButton type="submit" loading={isSubmitting}>
                            Submit
                    </LoadingButton>
                </div>
            </form>
        </Form>
    )
}