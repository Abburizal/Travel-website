<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Illuminate\Support\Facades\DB;

class TopCustomersWidget extends BaseWidget
{
    protected static ?int $sort = 4;
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->heading('Top Customers')
            ->query(
                User::select('users.*')
                    ->leftJoin('bookings', 'users.id', '=', 'bookings.user_id')
                    ->selectRaw('COUNT(bookings.id) as bookings_count')
                    ->selectRaw('SUM(CASE WHEN bookings.status = "paid" THEN bookings.total_price ELSE 0 END) as total_spent')
                    ->groupBy('users.id')
                    ->having('bookings_count', '>', 0)
                    ->orderBy('total_spent', 'desc')
                    ->limit(10)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Customer Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('bookings_count')
                    ->label('Total Bookings')
                    ->badge()
                    ->color('success')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_spent')
                    ->label('Total Spent')
                    ->money('IDR')
                    ->sortable()
                    ->summarize([
                        Tables\Columns\Summarizers\Sum::make()
                            ->money('IDR')
                            ->label('Total Revenue'),
                    ]),
            ]);
    }
}
