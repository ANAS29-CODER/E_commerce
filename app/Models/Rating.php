<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rating extends Model
{
    use HasFactory;


    public function rateable(){

        return $this->morphTo('rateable','rateable_id','rateable_type','id');
        
    }
}
