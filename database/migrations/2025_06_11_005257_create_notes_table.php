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
        Schema::create('notes', function (Blueprint $table) {
            $table->id(); // 'id' will be a big integer primary key
            $table->string('title');
            $table->text('content')->nullable(); // use 'text' for large note body
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // PostgreSQL-safe FK
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notes');
    }
};
