import {SubmitHandler, useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import Modal from "./Model";
import {SubjectSchema} from "@/lib/validations/subject-schema";
import {DynamicDropdown} from "../ui/dynamic-dropdown";
import {Subject} from "@/types/subject";
import {Standard} from "@/types/standard";
import {useEffect} from "react";

interface SubjectDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialValues?: Subject | null;
    onSubmit: SubmitHandler<any>;
    dropdownItems: Standard[];
}

const SubjectDialog = ({
                           isOpen,
                           onClose,
                           initialValues,
                           onSubmit,
                           dropdownItems,
                       }: SubjectDialogProps) => {
    const form = useForm<SubjectSchema>({
        defaultValues: {
            subject: "",
            standard: "",
        },
    });

    const items = dropdownItems.map((item) => ({
        label: item.std,
        id: item._id,
    }));

    useEffect(() => {
        form.reset({
            subject: initialValues?.subject || "",
            standard: initialValues?.standard?._id || "",
        });
    }, [form, initialValues]);

    const handleCancel = () => {
        // reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleCancel}>
            <h2 className="text-xl font-bold mb-4">
                {initialValues ? "Edit Subject" : "Add Subject"}
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="subject"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Subject Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter subject name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="standard"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Standard</FormLabel>
                                <DynamicDropdown
                                    placeholder="Select items"
                                    name="standard"
                                    control={form.control}
                                    onSearch={() => {
                                    }}
                                    listing={items}
                                    onItemSelect={(_) => {
                                    }}
                                />
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">Submit</Button>
                    </div>
                </form>
            </Form>
        </Modal>
    );
};

export default SubjectDialog;
