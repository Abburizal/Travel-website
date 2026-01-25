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
        Schema::table('tours', function (Blueprint $table) {
            $table->json('highlights')->nullable()->after('description');
            $table->json('included')->nullable()->after('highlights');
            $table->json('excluded')->nullable()->after('included');
            $table->string('departure_location')->nullable()->after('destination');
            $table->date('available_from')->nullable()->after('end_date');
            $table->date('available_until')->nullable()->after('available_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tours', function (Blueprint $table) {
            $table->dropColumn([
                'highlights',
                'included',
                'excluded',
                'departure_location',
                'available_from',
                'available_until'
            ]);
        });
    }
};
