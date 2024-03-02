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

const headerTag = (column, title) => (
    <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
        {title}
        <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
);

export default function Posts(props) {
    const { auth, posts, categories } = props;
    const [action, setAction] = useState("add");
    const { toast } = useToast();

    console.log(posts);
    const defaultPostState = {
        slug: "",
        title: "",
        description: "",
        content: "",
        user_id: auth.user.id,
        category_id: 1,
        image: null,
    };
    const { data, setData, post, put, reset, errors, processing } =
        useForm(defaultPostState);

    const columns = [
        {
            accessorKey: "id",
            header: ({ column }) => headerTag(column, "ID"),
        },
        {
            accessorKey: "slug",
            header: ({ column }) => headerTag(column, "Slug"),
        },
        {
            accessorKey: "title",
            header: ({ column }) => headerTag(column, "Title"),
        },
        {
            accessorKey: "description",
            header: ({ column }) => headerTag(column, "Description"),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const post = row.original;
                return (
                    <>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant={"outline"}
                                className="mr-1"
                                onClick={() => {
                                    setAction("edit");
                                    setData({
                                        ...post,
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
                                        ...post,
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
            description: "Post could not be " + action + "ed!",
        });
    };
    const onSuccess = () => {
        toast({
            title: "Success!",
            description: "Post has been " + action + "ed successfully!",
        });
    };
    const generateSlug = () => {
        return data.title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    };
    const submit = (e) => {
        e.preventDefault();
        console.log(data);
        if (action === "add") {
            post(route("post.store"), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        if (action === "edit") {
            console.log(data);
            post(route("post.update", data.id), {
                data,
                preserveScroll: true,
                onSuccess: onSuccess,
                onError: onError,
            });
        }
        setData(defaultPostState);
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
                        Posts
                    </h2>
                </>
            }
        >
            <Head title="Posts" />
            <>
                {/*
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
                                                        New Post
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </TableCaption>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[100px]">
                                                        ID
                                                    </TableHead>
                                                    <TableHead>Title</TableHead>
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
                                                {posts.map((post) => (
                                                    <TableRow key={post.id}>
                                                        <TableCell>{post.id}</TableCell>
                                                        <TableCell>
                                                            {post.title}
                                                        </TableCell>
                                                        <TableCell>
                                                            {post.slug}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {post.description.length >
                                                            50
                                                                ? post.description.substring(
                                                                    0,
                                                                    50
                                                                ) + "..."
                                                                : post.description}
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
                                                                            ...post,
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
                                                                            ...post,
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
                                            Add New Post
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData("title", e.target.value)
                                                }
                                            />
                                            <div className="flex gap-2">
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
                                                        value={data.category_id}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Categoy" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        value={
                                                                            category.id
                                                                        }
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
                                        <AlertDialogTitle>Edit Post</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            <Label htmlFor="title">Title</Label>
                                            <Input
                                                id="title"
                                                type="text"
                                                value={data.title}
                                                onChange={(e) =>
                                                    setData("title", e.target.value)
                                                }
                                            />
                                            <div className="flex gap-2">
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
                                                        value={data.category_id}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Categoy" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {categories.map(
                                                                (category) => (
                                                                    <SelectItem
                                                                        value={
                                                                            category.id
                                                                        }
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
                                                className="font-mono h-96"
                                                value={data.content}
                                                onChange={(e) =>
                                                    setData("content", e.target.value)
                                                }
                                                asChild={<b>{data.content}</b>}
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
                */}
            </>

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
                                            New Post
                                        </Button>
                                    </AlertDialogTrigger>
                                </div>
                                <DataTable columns={columns} data={posts} />
                            </div>
                        </div>
                    </div>
                </div>

                {action === "add" && (
                    <AlertDialogContent className="max-w-6xl">
                        <form onSubmit={submit}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>
                                    Add New Post
                                </AlertDialogTitle>
                                <AlertDialogDescription className="overflow-scroll h-[50vh]">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2">
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
                                <AlertDialogTitle>Edit Post</AlertDialogTitle>
                                <AlertDialogDescription className="overflow-scroll h-[50vh]">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) =>
                                            setData("title", e.target.value)
                                        }
                                    />
                                    <div className="flex gap-2">
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
                                                    <SelectValue placeholder="Categoy" />
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
