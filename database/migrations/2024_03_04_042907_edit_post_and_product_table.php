<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::table('posts', function (Blueprint $table) {
            $table->integer('views')->after('image')->default(0);
            $table->timestamp('published_at')->nullable()->after('updated_at');
            $table->boolean('is_published')->default(false)->before('created_at');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('slug')->after('name');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('views');
            $table->dropColumn('published_at');
            $table->dropColumn('is_published');
        });
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('slug');
        });
    }
};
