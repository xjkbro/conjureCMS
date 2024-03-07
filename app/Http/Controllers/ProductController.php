<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProductController extends Controller
{
    //
    public function index(){
        $user = auth()->user();
        $products = Product::where('user_id', $user->id)->get();
        $categories = Category::where('user_id', $user->id)->get();
        return Inertia::render('Products', ['products' => $products,  'categories' => $categories]);
    }

    public function productById($id){
        $product = Product::find($id);
        return response()->json($product);
    }
    public function productBySlug($slug){
        $product = Product::where('slug', $slug)->first();
        return response()->json($product);
    }


    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required',
            'name' => 'required',
            'description' => 'required',
            'content' => 'required',
            'price' => 'required',
            'status' => 'required',
            'user_id' => 'required',
            'category_id' => 'required'
        ]);
        $user = auth()->user();
        $product = new Product();
        $product->slug = $request->slug;
        $product->name = $request->name;
        $product->description = $request->description;
        $product->content = $request->content;
        $product->price = $request->price;
        $product->status = $request->status;
        $product->user_id = $user->id;
        $product->category_id = $request->category_id;
        if($request->hasFile('image'))
        {
            $upload = $request->file('image')->store('uploads', 'public');
            $product->image = Storage::url($upload);
        }
        try {
            $product->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Product was added.'
        ]);


    }
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'slug' => 'required',
            'name' => 'required',
            'description' => 'required',
            'content' => 'required',
            'price' => 'required',
            'status' => 'required',
            'user_id' => 'required',
            'category_id' => 'required'
        ]);

        $product->slug = $request->slug;
        $product->name = $request->name;
        $product->description = $request->description;
        $product->content = $request->content;
        $product->price = $request->price;
        $product->status = $request->status;
        $product->category_id = $request->category_id;
        if($request->hasFile('image'))
        {
            if($product->image)
            {
                Storage::delete('public/'.$product->image);
            }
            $upload = $request->file('image')->store('uploads', 'public');
            $product->image = Storage::url($upload);
        }
        try {
            $product->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Product was updated.'
        ]);

    }

    public function destroy(Product $product)
    {
        if($product->image)
        {
            Storage::delete('public/'.$product->image);
        }
        $product->delete();
        return Redirect::route('products')->with([
            'type' => 'success',
            'message' => 'Product was deleted.'
        ]);
    }
}
