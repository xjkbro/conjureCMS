<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

use function Laravel\Prompts\error;

class PostController extends Controller
{

    public function index()
    {
        $user = auth()->user();
        $posts = Post::where('user_id', $user->id)->get();
        $categories = Category::where('user_id', $user->id)->get();
        return Inertia::render('Posts', ['posts' => $posts,  'categories' => $categories]);
    }
    public function postById($id)
    {
        $post = Post::find($id);
        return response()->json($post);
    }
    public function postBySlug($slug)
    {
        $post = Post::where('slug', $slug)->first();
        return response()->json($post);
    }
    public function postsByUser($id)
    {
        $posts = Post::where('user_id', $id)->get();
        return response()->json($posts);
    }
    public function postsByCategory($id)
    {
        $posts = Post::where('category_id', $id)->get();
        return response()->json($posts);
    }
    public function updatePostViewCount($id)
    {
        $post = Post::find($id);
        $post->views = $post->views + 1;
        $post->save();
        return response()->json($post);
    }

    public function store(Request $request)
    {
        $request->validate([
            'slug' => 'required|unique:posts',
            'title' => 'required',
            'description' => 'required',
            'content' => 'required',
            'user_id' => 'required',
            'category_id' => 'required'
        ]);
        $user = auth()->user();
        $post = new Post();
        $post->slug = $request->slug;
        $post->title = $request->title;
        $post->description = $request->description;
        $post->content = $request->content;
        $post->user_id = $user->id;
        $post->category_id = $request->category_id;
        if($request->hasFile('image'))
        {
            $upload = $request->file('image')->store('uploads', 'public');
            $post->image = Storage::url($upload);
        }
        try {
            $post->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Post was added.'
        ]);


    }
    public function update(Request $request, Post $post)
    {
        $request->validate([
            'slug' => 'required',
            'title' => 'required',
            'description' => 'required',
            'content' => 'required',
            'user_id' => 'required',
            'category_id' => 'required'
        ]);

        $post->slug = $request->slug;
        $post->title = $request->title;
        $post->description = $request->description;
        $post->content = $request->content;
        $post->category_id = $request->category_id;
        if($request->hasFile('image'))
        {
            if($post->image)
            {
                Storage::delete('public/'.$post->image);
            }
            $upload = $request->file('image')->store('uploads', 'public');
            $post->image = Storage::url($upload);
        }
        try {
            $post->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'Post was updated.'
        ]);

    }

    public function destroy(Post $post)
    {
        if($post->image)
        {
            Storage::delete('public/'.$post->image);
        }
        $post->delete();
        return Redirect::route('posts')->with([
            'type' => 'success',
            'message' => 'Post was deleted.'
        ]);
    }
}
