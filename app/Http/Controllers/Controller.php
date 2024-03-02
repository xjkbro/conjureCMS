<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function getUserItems($id){
        $user = User::find($id);
        if($user->isNotActive()){
            return response()->json(['posts' => [], 'categories' => []]);
        }
        $posts = Post::where('user_id',$id)->get();
        $categories = Category::where('user_id',$id)->get();
        return response()->json(['posts' => $posts, 'categories' => $categories]);
    }
}
