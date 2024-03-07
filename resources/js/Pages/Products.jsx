import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shadcn/ui/select";
import { DataTable } from "@/Components/DataTable";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { set } from "react-hook-form";
import Checkbox from "@/Components/Checkbox";

const headerTag = (column, title) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

export default function Products(props) {
    const { auth, categories, products } = props;
    const [action, setAction] = useState("add");
    const { toast } = useToast();

    console.log(products);
    const defaultProductState = {
        slug: "",
        name: "",
        description: "",
        content: "",
        price: 0,
        status: "active",
        user_id: auth.user.id,
        category_id: 1,
        image: null,
    };
    const { data, setData, post, put, reset, errors, processing } =
        useForm(defaultProductState);

    const columns = [
        {
            accessorKey: "id",
            header: ({ column }) => headerTag(column, "ID"),
        },
        {
            accessorKey: "name",
            header: ({ column }) => headerTag(column, "Name"),
        },
        {
            accessorKey: "slug",
            header: ({ column }) => headerTag(column, "Slug"),
        },
        {
            accessorKey: "description",
            header: ({ column }) => headerTag(column, "Description"),
        },
        {
            accessorKey: "price",
            header: ({ column }) => headerTag(column, "Price"),
            cell: ({ row }) => {
                const product = row.original;
                return <>${product.price}</>;
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => headerTag(column, "Status"),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const product = row.original;
                return (
                    <>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="mr-1"
                                onClick={() => {
                                    setAction("edit");
                                    setData({
                                        ...product,
                                    });
                                }}
                            >
                                Edit
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant={"destructive"}
                                onClick={() => {
                                    setAction("delete");
                                    setData({
                                        ...product,
                                    });
                                }}
                            >
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                    </>
                );
            },
        },
    ];
    const onError = (error) => {
        toast({
            title: "Uh Oh!",
            description: "Product could not be " + action + "ed!",
        });
    };
    const onSuccess = () => {
        toast({
            title: "Success!",
            description: "Product has been " + action + "ed successfully!",
        });
    };
    const generateSlug = () => {
        return data.name
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    };
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        if (action === "add") {
            post(route("product.store"), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        if (action === "edit") {
            console.log(data);
            post(route("product.update", data.id), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        setData(defaultProductState);
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <>
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Products
                    </h2>
                </>
            }
        >
            <Head title="Products" />

            <AlertDialog>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div className="mb-2 flex justify-end">
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            onClick={() => setAction("add")}
                                        >
                                            New Product
                                        </Button>
                                    </AlertDialogTrigger>
                                </div>
                                <DataTable columns={columns} data={products} />
                            </div>
                        </div>
                    </div>
                </div>

                {action === "add" && (
                    <AlertDialogContent className="max-w-6xl">
                        <form onSubmit={submit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Add New Product
                                </AlertDialogTitle>
                                <AlertDialogDescription className="overflow-scroll h-[50vh]">
                                    <div className="flex gap-2 ">
                                        <div className="w-full">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <Label>Status</Label>
                                            <Button
                                                variant={
                                                    data.status === "active"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    data.status === "active"
                                                        ? setData(
                                                              "status",
                                                              "inactive"
                                                          )
                                                        : setData(
                                                              "status",
                                                              "active"
                                                          );
                                                }}
                                            >
                                                {data.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="w-full">
                                            <Label htmlFor="slug">Slug</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="slug"
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) =>
                                                        setData(
                                                            "slug",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setData(
                                                            "slug",
                                                            generateSlug()
                                                        );
                                                    }}
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <Label htmlFor="category">
                                                Category
                                            </Label>
                                            <Select
                                                id="category"
                                                value={data.category_id.toString()}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "category_id",
                                                        parseInt(value)
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                value={category.id.toString()}
                                                                key={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-full">
                                            <Label htmlFor="category">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
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
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        value={data.content}
                                        className="font-mono min-h-64"
                                        onChange={(e) =>
                                            setData("content", e.target.value)
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
                                <AlertDialogCancel
                                    onClick={() => setData(defaultPostState)}
                                >
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button type="submit">Save</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </form>
                    </AlertDialogContent>
                )}

                {action === "edit" && (
                    <AlertDialogContent className="max-w-6xl">
                        <form onSubmit={submit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Edit Post</AlertDialogTitle>
                                <AlertDialogDescription className="overflow-scroll h-[50vh]">
                                    <div className="flex gap-2 ">
                                        <div className="w-full">
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) =>
                                                    setData(
                                                        "name",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="flex flex-col justify-center items-center gap-1">
                                            <Label>Status</Label>
                                            <Button
                                                variant={
                                                    data.status === "active"
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    data.status === "active"
                                                        ? setData(
                                                              "status",
                                                              "inactive"
                                                          )
                                                        : setData(
                                                              "status",
                                                              "active"
                                                          );
                                                }}
                                            >
                                                {data.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="w-full">
                                            <Label htmlFor="slug">Slug</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    id="slug"
                                                    type="text"
                                                    value={data.slug}
                                                    onChange={(e) =>
                                                        setData(
                                                            "slug",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant={"outline"}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setData(
                                                            "slug",
                                                            generateSlug()
                                                        );
                                                    }}
                                                >
                                                    Generate
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <Label htmlFor="category">
                                                Category
                                            </Label>
                                            <Select
                                                id="category"
                                                value={data.category_id.toString()}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "category_id",
                                                        parseInt(value)
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map(
                                                        (category) => (
                                                            <SelectItem
                                                                value={category.id.toString()}
                                                                key={
                                                                    category.id
                                                                }
                                                            >
                                                                {category.name}
                                                            </SelectItem>
                                                        )
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-full">
                                            <Label htmlFor="category">
                                                Price
                                            </Label>
                                            <Input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
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
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        id="content"
                                        className="font-mono min-h-64"
                                        value={data.content}
                                        onChange={(e) =>
                                            setData("content", e.target.value)
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
                                <AlertDialogCancel
                                    onClick={() => setData(defaultPostState)}
                                >
                                    Cancel
                                </AlertDialogCancel>
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
