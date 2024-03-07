<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function index(){
        $users = User::all();
        return Inertia::render('Users', ['users' => $users]);
    }

    public function update(Request $request, User $user)
    {
        //idk why this is breaking the request
        // $request->validate([
        //     'username' => 'required|unique:users',
        //     'name' => 'required',
        //     'role' => 'required|in:admin,mod,user',
        //     'active' => 'required'
        // ]);

        //check for unique username
        if($user->username !== $request->username){
            $request->validate([
                'username' => 'required|unique:users'
            ]);
        }

        $user->username = $request->username;
        $user->name = $request->name;
        $user->role = $request->role;
        $user->active = $request->active;

        try {
            $user->save();
        } catch (\Throwable $th) {
            return redirect()->back()->withErrors([
                'error' => $th->getMessage()
            ]);
        }
        return back()->with([
            'type' => 'success',
            'message' => 'User was updated.'
        ]);

    }

    public function getUserItemsId($id){
        $user = User::find($id);
        if($user->isNotActive()){
            return response()->json(['posts' => [], 'categories' => []]);
        }
        $posts = Post::where('user_id',$id)->get();
        $categories = Category::where('user_id',$id)->get();
        $products = Product::where('user_id',$id)->get();
        return response()->json(['posts' => $posts, 'categories' => $categories, 'products' => $products]);
    }

    public function getUserItems($username){

        $user = User::where('username', $username)->first();

        if($user->isNotActive()){
            return response()->json(['posts' => [], 'categories' => []]);
        }
        $posts = Post::where('user_id',$user->id)->get();
        $categories = Category::where('user_id',$user->id)->get();
        $products = Product::where('user_id',$user->id)->get();
        return response()->json(['posts' => $posts, 'categories' => $categories, 'products' => $products]);
    }

}
