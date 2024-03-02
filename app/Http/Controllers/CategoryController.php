<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CategoryController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        $categories = Category::where('user_id', $user->id)->get();
        return Inertia::render('Categories', ['categories' => $categories]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required|unique:categories',
            'name' => 'required',
            'description' => 'required',
            'user_id' => 'required',
        ]);
        $user = auth()->user();
        $category = new Category();
        $category->slug = $request->slug;
        $category->name = $request->name;
        $category->description = $request->description;
        $category->user_id = $user->id;
        if($request->hasFile('image'))
        {
            $upload = $request->file('image')->store('uploads', 'public');
            $category->image = Storage::url($upload);
        }
        try {
            $category->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Category was updated.'
        ]);


    }
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'slug' => 'required',
            'name' => 'required',
            'description' => 'required',
            'user_id' => 'required',
        ]);

        $category->slug = $request->slug;
        $category->name = $request->name;
        $category->description = $request->description;
        if($request->hasFile('image'))
        {
            if($category->image)
            {
                Storage::delete('public/'.$category->image);
            }
            $upload = $request->file('image')->store('uploads', 'public');
            $category->image = Storage::url($upload);
        }
        try {
            $category->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Category was updated.'
        ]);

    }

    public function destroy(Category $category)
    {
        if($category->image)
        {
            Storage::delete('public/'.$category->image);
        }
        $category->delete();
        return Redirect::route('categories')->with([
            'type' => 'success',
            'message' => 'Category was deleted.'
        ]);
    }
}
