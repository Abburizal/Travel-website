<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BookingResource\Pages;
use App\Filament\Resources\BookingResource\RelationManagers;
use App\Models\Booking;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class BookingResource extends Resource
{
    protected static ?string $model = Booking::class;

    protected static ?string $navigationIcon = 'heroicon-o-ticket';
    
    protected static ?string $navigationLabel = 'Bookings';
    
    protected static ?int $navigationSort = 2;
    
    protected static ?string $navigationGroup = 'Travel Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('user_id')
                    ->label('User')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->required()
                    ->reactive()
                    ->disabled(fn ($record) => $record !== null),
                    
                Forms\Components\Select::make('tour_id')
                    ->label('Tour')
                    ->relationship('tour', 'name')
                    ->searchable()
                    ->required()
                    ->reactive()
                    ->disabled(fn ($record) => $record !== null)
                    ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                        if ($state && $participants = $get('number_of_participants')) {
                            $tour = \App\Models\Tour::find($state);
                            if ($tour) {
                                $set('total_price', $tour->price * $participants);
                            }
                        }
                    }),
                    
                Forms\Components\DateTimePicker::make('booking_date')
                    ->label('Booking Date')
                    ->required()
                    ->default(now())
                    ->minDate(now())
                    ->native(false),
                    
                Forms\Components\TextInput::make('number_of_participants')
                    ->label('Participants')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->default(1)
                    ->reactive()
                    ->afterStateUpdated(function ($state, Forms\Set $set, Forms\Get $get) {
                        if ($state && $tourId = $get('tour_id')) {
                            $tour = \App\Models\Tour::find($tourId);
                            if ($tour) {
                                $set('total_price', $tour->price * $state);
                            }
                        }
                    }),
                    
                Forms\Components\TextInput::make('total_price')
                    ->label('Total Price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp')
                    ->hint('Auto-calculated based on tour price × participants')
                    ->disabled()
                    ->dehydrated(),
                    
                Forms\Components\Select::make('status')
                    ->label('Status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'paid' => 'Paid',
                        'cancelled' => 'Cancelled',
                        'completed' => 'Completed',
                    ])
                    ->default('pending')
                    ->required(),
                    
                Forms\Components\DateTimePicker::make('expired_at')
                    ->label('Expires At')
                    ->hint('Auto-set to 30 minutes from now')
                    ->default(fn () => now()->addMinutes(30))
                    ->native(false),
                    
                Forms\Components\Textarea::make('notes')
                    ->label('Notes')
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('tour.name')
                    ->label('Tour')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('booking_date')
                    ->label('Booking Date')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('number_of_participants')
                    ->label('Participants')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Price')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'warning' => 'pending',
                        'info' => 'confirmed',
                        'success' => 'paid',
                        'danger' => 'cancelled',
                        'primary' => 'completed',
                    ]),
                Tables\Columns\TextColumn::make('expired_at')
                    ->label('Expires At')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'confirmed' => 'Confirmed',
                        'paid' => 'Paid',
                        'cancelled' => 'Cancelled',
                        'completed' => 'Completed',
                    ]),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBookings::route('/'),
            'create' => Pages\CreateBooking::route('/create'),
            'view' => Pages\ViewBooking::route('/{record}'),
            'edit' => Pages\EditBooking::route('/{record}/edit'),
        ];
    }
}
