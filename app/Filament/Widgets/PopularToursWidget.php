<?php

namespace App\Filament\Widgets;

use App\Models\Tour;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ImageColumn;
use Illuminate\Database\Eloquent\Builder;

class PopularToursWidget extends BaseWidget
{
    protected static ?int $sort = 5;
    
    protected int | string | array $columnSpan = 'full';
    
    public function table(Table $table): Table
    {
        return $table
            ->query(
                Tour::query()
                    ->withCount('bookings')
                    ->orderBy('bookings_count', 'desc')
                    ->limit(5)
            )
            ->heading('Popular Tours (Most Booked)')
            ->columns([
                ImageColumn::make('image_url')
                    ->label('Image')
                    ->circular()
                    ->defaultImageUrl('/images/tour-placeholder.jpg')
                    ->size(60),
                    
                TextColumn::make('name')
                    ->label('Tour Package')
                    ->searchable()
                    ->weight('bold')
                    ->limit(40)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return strlen($state) > 40 ? $state : null;
                    }),
                    
                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->color('info'),
                    
                TextColumn::make('destination')
                    ->label('Destination')
                    ->icon('heroicon-m-map-pin')
                    ->limit(20),
                    
                TextColumn::make('price')
                    ->label('Price')
                    ->money('IDR')
                    ->sortable(),
                    
                TextColumn::make('bookings_count')
                    ->label('Bookings')
                    ->alignCenter()
                    ->badge()
                    ->color('success')
                    ->icon('heroicon-m-ticket')
                    ->sortable(),
                    
                TextColumn::make('available_seats')
                    ->label('Available')
                    ->alignCenter()
                    ->color(fn ($state) => $state < 5 ? 'danger' : ($state < 10 ? 'warning' : 'success'))
                    ->badge()
                    ->icon('heroicon-m-users'),
            ])
            ->actions([
                Tables\Actions\Action::make('edit')
                    ->label('Edit')
                    ->icon('heroicon-m-pencil-square')
                    ->url(fn (Tour $record): string => route('filament.admin.resources.tours.edit', ['record' => $record]))
                    ->color('warning'),
            ]);
    }
}
