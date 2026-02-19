"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";

export default function AddProductPage() {
    const generateUploadUrl = useMutation(api.products.generateUploadUrl);
    const createProduct = useMutation(api.products.create);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        isActive: true
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, isActive: e.target.checked }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let imageId = ""; // Default or placeholder if needed

            if (selectedImage) {
                // 1. Get upload URL
                const postUrl = await generateUploadUrl();

                // 2. Upload file
                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": selectedImage.type },
                    body: selectedImage,
                });

                if (!result.ok) {
                    throw new Error(`Upload failed: ${result.statusText}`);
                }

                const { storageId } = await result.json();
                imageId = storageId;
            }

            // 3. Create product with storage ID
            await createProduct({
                name: formData.name,
                description: formData.description,
                price: Number(formData.price),
                category: formData.category,
                image: imageId as Id<"_storage">,
                stock: Number(formData.stock),
                isActive: formData.isActive,
            });

            toast.success("Product created successfully");
            router.push("/dashboard/products");
            setFormData({
                name: "",
                description: "",
                price: "",
                category: "",
                stock: "",
                isActive: true
            });
            setSelectedImage(null);
        } catch (error) {
            console.error("Failed to create product:", error);
            toast.error("Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isClient) return null

    return (
        <div className="container mx-auto p-6 max-w-2xl bg-muted/40 min-h-screen flex items-center justify-center">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Add New Product</CardTitle>
                    <CardDescription>Enter product details to add to the catalog.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="e.g. Classic Chin Chin"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                name="description"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Product description..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (Kobo)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="1500"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input
                                    id="stock"
                                    name="stock"
                                    type="number"
                                    placeholder="100"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Input
                                id="category"
                                name="category"
                                placeholder="e.g. Sweet, Savory, Spicy"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Product Image</Label>
                            <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                required
                            />
                            {selectedImage && (
                                <p className="text-sm text-muted-foreground">Selected: {selectedImage.name}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="isActive">Active (Visible in catalog)</Label>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Product"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
