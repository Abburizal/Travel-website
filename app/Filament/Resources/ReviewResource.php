<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Models\Review;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReviewApproved;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    protected static ?string $navigationIcon = 'heroicon-o-star';
    
    protected static ?string $navigationLabel = 'Reviews';
    
    protected static ?int $navigationSort = 4;
    
    protected static ?string $navigationGroup = 'Travel Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Review Information')
                    ->schema([
                        Forms\Components\Select::make('user_id')
                            ->label('User')
                            ->relationship('user', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\Select::make('tour_id')
                            ->label('Tour')
                            ->relationship('tour', 'name')
                            ->required()
                            ->searchable()
                            ->preload(),
                        Forms\Components\Select::make('booking_id')
                            ->label('Booking')
                            ->relationship('booking', 'id')
                            ->required()
                            ->searchable()
                            ->preload(),
                    ])->columns(3),
                
                Forms\Components\Section::make('Review Content')
                    ->schema([
                        Forms\Components\Select::make('rating')
                            ->label('Rating')
                            ->options([
                                1 => '⭐ 1 Star - Poor',
                                2 => '⭐⭐ 2 Stars - Fair',
                                3 => '⭐⭐⭐ 3 Stars - Good',
                                4 => '⭐⭐⭐⭐ 4 Stars - Very Good',
                                5 => '⭐⭐⭐⭐⭐ 5 Stars - Excellent',
                            ])
                            ->required(),
                        Forms\Components\Textarea::make('comment')
                            ->label('Review Comment')
                            ->required()
                            ->rows(5)
                            ->columnSpanFull(),
                        Forms\Components\Toggle::make('is_approved')
                            ->label('Approved')
                            ->default(false)
                            ->helperText('Toggle to approve/reject this review'),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('tour.name')
                    ->label('Tour')
                    ->searchable()
                    ->sortable()
                    ->limit(30),
                Tables\Columns\TextColumn::make('rating')
                    ->label('Rating')
                    ->formatStateUsing(fn ($state) => str_repeat('⭐', $state))
                    ->sortable(),
                Tables\Columns\TextColumn::make('comment')
                    ->label('Review')
                    ->limit(50)
                    ->searchable(),
                Tables\Columns\IconColumn::make('is_approved')
                    ->label('Status')
                    ->boolean()
                    ->trueIcon('heroicon-o-check-circle')
                    ->falseIcon('heroicon-o-x-circle')
                    ->trueColor('success')
                    ->falseColor('danger')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Submitted')
                    ->dateTime('M d, Y')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('rating')
                    ->options([
                        1 => '1 Star',
                        2 => '2 Stars',
                        3 => '3 Stars',
                        4 => '4 Stars',
                        5 => '5 Stars',
                    ]),
                Tables\Filters\TernaryFilter::make('is_approved')
                    ->label('Approval Status')
                    ->placeholder('All reviews')
                    ->trueLabel('Approved only')
                    ->falseLabel('Pending only'),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                
                // Approve Action
                Tables\Actions\Action::make('approve')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->requiresConfirmation()
                    ->action(function (Review $record) {
                        $record->update(['is_approved' => true]);
                        
                        // Send approval email to user
                        $record->load(['user', 'tour']);
                        Mail::to($record->user->email)->queue(new ReviewApproved($record));
                        
                        Notification::make()
                            ->title('Review Approved')
                            ->success()
                            ->send();
                    })
                    ->visible(fn (Review $record) => !$record->is_approved),
                
                // Reject Action
                Tables\Actions\Action::make('reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->action(function (Review $record) {
                        $record->update(['is_approved' => false]);
                        Notification::make()
                            ->title('Review Rejected')
                            ->warning()
                            ->send();
                    })
                    ->visible(fn (Review $record) => $record->is_approved),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    
                    // Bulk Approve
                    Tables\Actions\BulkAction::make('approve')
                        ->label('Approve Selected')
                        ->icon('heroicon-o-check-circle')
                        ->color('success')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            foreach ($records as $record) {
                                $record->update(['is_approved' => true]);
                                
                                // Send approval email
                                $record->load(['user', 'tour']);
                                Mail::to($record->user->email)->queue(new ReviewApproved($record));
                            }
                            
                            Notification::make()
                                ->title('Reviews Approved')
                                ->success()
                                ->send();
                        }),
                    
                    // Bulk Reject
                    Tables\Actions\BulkAction::make('reject')
                        ->label('Reject Selected')
                        ->icon('heroicon-o-x-circle')
                        ->color('danger')
                        ->requiresConfirmation()
                        ->action(function ($records) {
                            $records->each->update(['is_approved' => false]);
                            Notification::make()
                                ->title('Reviews Rejected')
                                ->warning()
                                ->send();
                        }),
                ]),
            ]);
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
            'index' => Pages\ListReviews::route('/'),
            'create' => Pages\CreateReview::route('/create'),
            'edit' => Pages\EditReview::route('/{record}/edit'),
        ];
    }
}
