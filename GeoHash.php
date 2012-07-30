<?php

class GeoHash{
	
	static $DICT = '0123456789bcdefghjkmnpqrstuvwxyz';

	static function encode($lat, $lon, $precision){
		
		$res = '';

		$top = 90;
		$bottom = -90;
		$left = -180;
		$right = 180;

		$ch = 0;
		$bit = 0;			

		while (strlen($res) < $precision){
			
			if ($bit  % 2 ==0){
				$mid = ($left + $right) / 2;
				if ($lon > $mid) {					
					$ch |= 16 >> ($bit % 5);
					$left = $mid;					
				} else {
					$right = $mid;					
				}
			} else {
				$mid = ($top + $bottom) / 2;
				if ($lat > $mid) {					
					$ch |= 16 >> ($bit % 5);
					$bottom = $mid;
				} else {
					$top = $mid;
				}
			}

			$bit ++;
			if ($bit % 5 == 0){
				$res .= GeoHash::$DICT{$ch};
				$ch = 0;
			}
		}

		return $res;
	}

	static function decode($hash){		

		$top = 90;
		$bottom = -90;
		$left = -180;
		$right = 180;
		
		$bit = 0;
		
		for ($i = 0; $i < strlen($hash); $i++){	
			$ch = strpos(GeoHash::$DICT, $hash{$i});		
			for ($j = 0; $j < 5; $j++){
				if ($bit % 2 == 0){
					$mid = ($left + $right) / 2;
					if ($ch  & (16 >> ($bit % 5))){
						$left = $mid;
					} else {
						$right = $mid;
					}
				} else {
					$mid = ($top + $bottom) / 2;
					if ($ch  & (16 >> ($bit % 5))){
						$bottom = $mid;
					} else {
						$top = $mid;
					}
				}

				$bit ++;
			}
		}
		
		$ret = new stdClass();
		$ret->lat = ($top + $bottom) / 2;
		$ret->lon = ($left + $right) / 2;
		
		return $ret;
	}

}

?>