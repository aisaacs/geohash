var GeoHash = {	

	DICT: "0123456789bcdefghjkmnpqrstuvwxyz",

	encode: function(lat, lon, precision){

		if (!precision) precision = 12;
		var res = '';

		var bounds = {
			bottom: -90.0,
			top: 90.0,
			left: -180,
			right: 180 
		};

		var ch = 0;
		var bit = 0;		

		while (res.length < precision){
			
			if (bit  % 2 ==0){
				var mid = (bounds.left + bounds.right) / 2;
				if (lon > mid) {					
					ch |= 16 >> (bit % 5);
					bounds.left = mid;					
				} else {
					bounds.right = mid;					
				}
			} else {
				var mid = (bounds.top + bounds.bottom) / 2;
				if (lat > mid) {					
					ch |= 16 >> (bit % 5);
					bounds.bottom = mid;					
				} else {
					bounds.top = mid;					
				}
			}

			bit ++;
			if (bit % 5 == 0){
				res += this.DICT[ch];
				ch = 0;
			}
		}

		return res;
	},
	
	decode: function(hash){		

		var bounds = {
			bottom: -90.0,
			top: 90.0,
			left: -180,
			right: 180 
		};

		var bit = 0;
		
		for (var i = 0, l = hash.length; i < l; i++){
			var ch = this.DICT.indexOf(hash[i]);
			for (var j = 0; j < 5; j++){
				if (bit % 2 == 0){
					var mid = (bounds.left + bounds.right) / 2;
					if (ch  & (16 >> (bit % 5))){
						bounds.left = mid;
					} else {
						bounds.right = mid;
					}
				} else {
					var mid = (bounds.top + bounds.bottom) / 2;
					if (ch  & (16 >> (bit % 5))){
						bounds.bottom = mid;
					} else {
						bounds.top = mid;
					}
				}

				bit ++;
			}
		}

		return {lat: (bounds.top + bounds.bottom) / 2, lon: (bounds.left + bounds.right) / 2}
	}
}