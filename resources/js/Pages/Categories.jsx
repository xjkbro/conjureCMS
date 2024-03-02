import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shadcn/ui/table";
import { Button } from "@/shadcn/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/ui/alert-dialog";
import { Label } from "@/shadcn/ui/label";
import { Textarea } from "@/shadcn/ui/textarea";
import { Input } from "@/shadcn/ui/input";
import { useToast } from "@/shadcn/ui/use-toast";

export default function Categories(props) {
    const { auth, categories } = props;
    console.log(categories);
    const [action, setAction] = useState("add");
    const { toast } = useToast();
    const defaultCategoryState = {
        slug: "",
        name: "",
        description: "",
        user_id: auth.user.id,
        image: null,
    };
    const { data, setData, post, put, reset, errors, processing } =
        useForm(defaultCategoryState);

    const onError = (error) => {
        toast({
            title: "Uh Oh!",
            description: "Category could not be " + action + "ed!",
        });
    };
    const onSuccess = () => {
        toast({
            title: "Success!",
            description: "Category has been " + action + "ed successfully!",
        });
    };
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        if (action === "add") {
            post(route("category.store"), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        if (action === "edit") {
            console.log(data);
            post(route("category.update", data.id), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        setData(defaultCategoryState);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Categories
                </h2>
            }
        >
            <Head title="Categories" />
            <AlertDialog>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <Table>
                                    <TableCaption>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                onClick={() => setAction("add")}
                                            >
                                                New Category
                                            </Button>
                                        </AlertDialogTrigger>
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                ID
                                            </TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead className="text-center">
                                                Description
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {categories.map((category) => (
                                            <TableRow key={category.id}>
                                                <TableCell>
                                                    {category.id}
                                                </TableCell>
                                                <TableCell>
                                                    {category.name}
                                                </TableCell>
                                                <TableCell>
                                                    {category.slug}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {category.description
                                                        .length > 50
                                                        ? category.description.substring(
                                                              0,
                                                              50
                                                          ) + "..."
                                                        : category.description}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant={"outline"}
                                                            className="mr-1"
                                                            onClick={() => {
                                                                setAction(
                                                                    "edit"
                                                                );
                                                                setData({
                                                                    ...category,
                                                                });
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant={
                                                                "destructive"
                                                            }
                                                            onClick={() => {
                                                                setAction(
                                                                    "delete"
                                                                );
                                                                setData({
                                                                    ...category,
                                                                });
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>

                {action === "add" && (
                    <AlertDialogContent className="max-w-6xl">
                        <form onSubmit={submit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Add New Category
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                    />
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={(e) =>
                                            setData("image", e.target.files[0])
                                        }
                                    />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className={"mt-1"}>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button type="submit">Add</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                )}

                {action === "edit" && (
                    <AlertDialogContent className="max-w-6xl">
                        <form onSubmit={submit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Edit Category
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                    />
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) =>
                                            setData("slug", e.target.value)
                                        }
                                    />
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                    />
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        onChange={(e) =>
                                            setData("image", e.target.files[0])
                                        }
                                    />
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className={"mt-1"}>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button type="submit">Edit</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                )}

                {action === "delete" && (
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete your account and remove your
                                data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button
                                    onClick={() =>
                                        router.delete(
                                            route("delete.destroy", data.id)
                                        )
                                    }
                                >
                                    Delete
                                </Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                )}
            </AlertDialog>
        </AuthenticatedLayout>
    );
}
