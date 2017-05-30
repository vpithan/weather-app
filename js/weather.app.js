class WeatherApp {
	
	constructor() {
		this.weathers = this.getWeathers(data => this.weathers = data)
		this.filter = {
			none: () => {
				$( "#none" ).append(JSON.stringify(this.filterWeathersByDate()) || "Sem dados.")
			},
			lastSevenDays: () => {
				let dateInit = this.getDate("begin")
				dateInit.setDate(dateInit.getDate() - 7)
				let dateEnd = this.getDate("end")
				$( "#lastSevenDays" ).append(JSON.stringify(this.filterWeathersByDate(dateInit, dateEnd)) || "Sem dados.")
			},
			lastMonth: () => {
				let dateInit = this.getDate("begin")
				dateInit.setMonth(dateInit.getMonth() - 1)
				dateInit.setDate(1)
				let dateEnd = this.getDate("end")
				dateEnd.setDate(0)
				$("#lastMonth").append(JSON.stringify(this.filterWeathersByDate(dateInit, dateEnd)) || "Sem dados.")
			},
			thisMonth: () => {
				let dateInit = this.getDate("begin")
				dateInit.setDate(1)
				let dateEnd = this.getDate("end")
				dateEnd.setMonth(dateEnd.getMonth() + 1)
				dateEnd.setDate(0)
				$("#thisMonth").append(JSON.stringify(this.filterWeathersByDate(dateInit, dateEnd)) || "Sem dados.")
			},
			lastThirtyDays: () => {
				let dateInit = this.getDate("begin")
				dateInit.setDate(dateInit.getDate() - 30)
				let dateEnd = this.getDate("end")
				$("#lastThirtyDays").append(JSON.stringify(this.filterWeathersByDate(dateInit, dateEnd)) || "Sem dados.")
			},
			yesterday: () => {
				let dateInit = this.getDate("begin")
				dateInit.setDate(dateInit.getDate() - 1)
				let dateEnd = this.getDate("end")
				dateEnd.setDate(dateInit.getDate() - 1)
				$("#yesterday").append(JSON.stringify(this.filterWeathersByDate(dateInit, dateEnd)) || "Sem dados.")
			},
			today: () => {
				$("#today").append(
					JSON.stringify(
						this.filterWeathersByDate(this.getDate("begin"), this.getDate("end")) || "Sem dados."
				))
			}
		}
	}
	
	getWeathers(callback) {
		fetch("http://ghelfer.net/weatheraula.aspx?output=json")
		.then(response => response.text())
		.then(data => {
			let weathers = JSON.parse(data.replace("}erro", "}")).weather
			weathers.forEach(weather => weather.datetime = weather.datetime.replace(/\D/g,""))
			callback(weathers)
		})
	}
	
	getDate(day) {
		let date = new Date()
		switch(day) {
			case "begin":
				date.setHours(0)
				date.setMinutes(0)
				date.setSeconds(0)
				date.setMilliseconds(0)
				return date
			case "end":
				date.setHours(23)
				date.setMinutes(59)
				date.setSeconds(59)
				date.setMilliseconds(999)
				return date
		}
	}
	
	filterWeathersByDate(dateInit, dateEnd) {
			return this.getAvgWeather(this.weathers.filter(weather => {
			if (!dateInit||!dateEnd) {
				return true
			}
			let date = new Date(parseFloat(weather.datetime))
			return date >= dateInit && date <= dateEnd
		}))
	}
	
	getAvgWeather(weathers) {
		let avg = {
			temperature: 0,
			humidity: 0,
			pressure: 0,
			dewpoint: 0
		};
		weathers.forEach( weather => {
			avg.temperature += parseFloat( weather.temperature )
			avg.humidity += parseFloat( weather.humidity )
			avg.pressure += parseFloat( weather.pressure )
			avg.dewpoint += parseFloat( weather.dewpoint )
		});
		avg.temperature = ( avg.temperature / weathers.length ).toFixed( 2 )
		avg.humidity = ( avg.humidity / weathers.length ).toFixed( 2 )
		avg.pressure = ( avg.pressure / weathers.length ).toFixed( 2 )
		avg.dewpoint = ( avg.dewpoint / weathers.length ).toFixed( 2 )
		return avg;
	}
	
}
var app = new WeatherApp()