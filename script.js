

const KELVIN = 273;
 
 let weather = {
    apiKey: "3a5868758552a1cbd3d9a90347fa84b4",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q="
        + city
        + "&units=metric&appid="
        + this.apiKey
        )
        .then((response) => {
          if (!response.ok) {
            let timerInterval
            Swal.fire({
              title: 'Try another city please!',
              html: 'I will close in <b></b> milliseconds.',
              timer: 2000,
              timerProgressBar: true,
              didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                  b.textContent = Swal.getTimerLeft()
                }, 100)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {
              /* Read more about handling dismissals below */
              if (result.dismiss === Swal.DismissReason.timer) {
                console.log('I was closed by the timer')
              }
            });
          }
          return response.json();
        })
        .then((data) => this.displayWeather(data));
    },
      displayWeather: function (data) {
        const { name } = data;
        const { icon } = data.weather[0];
        const { description } = data.weather[0];
        const { temp, humidity  } = data.main;
        const { speed } = data.wind;
        const { country } = data.sys;

        document.querySelector(".city").innerText = " Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/"+ icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = `${Math.round(temp)} ºC`; 
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%"; 
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h"; 
        document.querySelector(".country").innerText = "Country: " + country; 
        document.querySelector(".weather ").classList.remove("loading");
        document.body.style.backgroundImage =
      "url('https://source.unsplash.com/1600x1500/?" + name + "')";
       },
          search: function () {
            this.fetchWeather(document.querySelector(".search-bar").value);
              },
            };
            //Geo code for diferent locations
            let geocode = {
              reverseGeocode: function (latitude, longitude) {
                var api_key = 'ceec7700d58e43cfb2468d97079cb4b0';
              var api_url = 'https://api.opencagedata.com/geocode/v1/json'
                var request_url = api_url
              + '?'
              + 'key=' + api_key
              + '&q=' + encodeURIComponent(latitude + ',' + longitude)
              + '&pretty=1'
              + '&no_annotations=1';
              
          // see full list of required and optional parameters:
          // https://opencagedata.com/api#forward
              
          var request = new XMLHttpRequest();
          request.open('GET', request_url, true);
              
          request.onload = function() {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes
          
            if (request.status === 200){ 
              // Success!
              var data = JSON.parse(request.responseText);
              weather.fetchWeather(data.results[0].components.city); // print the location
            } else if (request.status <= 500){ 
              // We reached our target server, but it returned an error

              console.log("unable to geocode! Response code: " + request.status);
              var data = JSON.parse(request.responseText);
              console.log('error msg: ' + data.status.message);
            } else {
              console.log("server error");
            }
          };
        
          request.onerror = function() {
            // There was a connection error of some sort
            console.log("unable to connect to server");
          };
          request.send();
        }, 
        getLocation: function() {
          function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
          }
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, console.error);
          }
          else {
            weather.fetchWeather("London");
          }
        }
      };

    document.querySelector(".search button").addEventListener("click", function(){
      weather.search(); 
    });

    document.querySelector(".search-bar").addEventListener("keyup", function(event) {
      if (event.key == "Enter") {
        weather.search(); 
      }
    }); 
    geocode.getLocation();
    window.addEventListener('load', () => {
      const container_loader = document.querySelector('.container_loader');
      container_loader.style.opacity = 0;
      container_loader.style.visibility = 'hidden';
  });
