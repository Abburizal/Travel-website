<?php

namespace App\Filament\Widgets;

use App\Models\Booking;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Illuminate\Database\Eloquent\Builder;

class RecentBookingsWidget extends BaseWidget
{
    protected static ?int $sort = 4;
    
    protected int | string | array $columnSpan = 'full';
    
    public function table(Table $table): Table
    {
        return $table
            ->query(
                Booking::query()
                    ->with(['user', 'tour'])
                    ->latest()
                    ->limit(5)
            )
            ->heading('Recent Bookings')
            ->columns([
                TextColumn::make('booking_code')
                    ->label('Booking Code')
                    ->searchable()
                    ->sortable()
                    ->weight('bold')
                    ->icon('heroicon-m-ticket')
                    ->color('primary'),
                    
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-m-user'),
                    
                TextColumn::make('tour.name')
                    ->label('Tour Package')
                    ->searchable()
                    ->limit(30)
                    ->tooltip(function (TextColumn $column): ?string {
                        $state = $column->getState();
                        return strlen($state) > 30 ? $state : null;
                    }),
                    
                TextColumn::make('number_of_people')
                    ->label('Pax')
                    ->alignCenter()
                    ->icon('heroicon-m-users'),
                    
                TextColumn::make('total_price')
                    ->label('Total')
                    ->money('IDR')
                    ->sortable(),
                    
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'paid',
                        'danger' => 'expired',
                        'secondary' => 'cancelled',
                    ])
                    ->icons([
                        'heroicon-m-clock' => 'pending',
                        'heroicon-m-check-circle' => 'paid',
                        'heroicon-m-x-circle' => 'expired',
                        'heroicon-m-minus-circle' => 'cancelled',
                    ])
                    ->sortable(),
                    
                TextColumn::make('created_at')
                    ->label('Booked At')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->since()
                    ->tooltip(fn ($record) => $record->created_at->format('d F Y, H:i:s')),
            ])
            ->actions([
                Tables\Actions\Action::make('view')
                    ->label('View')
                    ->icon('heroicon-m-eye')
                    ->url(fn (Booking $record): string => route('filament.admin.resources.bookings.view', ['record' => $record]))
                    ->color('primary'),
            ]);
    }
}
