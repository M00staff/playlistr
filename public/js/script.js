$("#makePlaylist").on("click", function(){
    $(".currentArtist").children().remove()
    var artist = $("#artistInput").val();
    var artist = artist.split(", ");
    var artistCode = "";
    for (i = 0; i < artist.length; i++) {
      artistCode += "&artist="+artist[i].split(' ').join('+')};
    var songCount = $("#songCount").val();
    $.getJSON("http://developer.echonest.com/api/v4/playlist/basic?api_key=6N51VGIQONFDX0AGP"+artistCode+"&format=json&results="+songCount+"&bucket=tracks&bucket=id:spotify", function(response){
        var tracks = [];
        for(i = 0;i < response.response.songs.length; i++){
            if (response.response.songs[i]["tracks"][0] === undefined) {
              continue;
            }
            else {
              console.log(response.response.songs[i]["tracks"][0]["foreign_id"])
              console.log(i)
              var track = response.response.songs[i]["tracks"][0]["foreign_id"]
              var newString = track.substr(14);
              tracks.push(newString);
            }
          }
        var ids = tracks.join();
        var playlistName = $("#listName").val();
        $(".currentArtist").append('<iframe id="musicframe" src="https://embed.spotify.com/?uri=spotify:trackset:'+playlistName+':'+ids+'" frameborder="0" height="500" width="400" allowtransparency="true"></iframe>')
    })

    //get request to echonest api for artist twitter handle; need to make dynamic for actual current artist, right now refs hardcoded "Chromeo"
    var currentArtist = "Chromeo";
    $.getJSON("http://developer.echonest.com/api/v4/artist/twitter?api_key=6N51VGIQONFDX0AGP&name=" + currentArtist + "&format=json", function(response){
      console.log(response);
      currentArtistTwitter = response.response.artist.twitter;
      console.log(currentArtistTwitter);
    })
})

function appendConcertInfo(events){
  for (i = 0; i < events.length; i ++){
    console.log(events[i]);
      $("body").append('<div class="concert"><h1>Concerts</h1><a href="'+events[i].url+'">'+events[i].artists[0]["name"]+'</a><p>'+events[i].datetime+'</p><a href="'+events[i].venue["url"]+'">'+events[i].venue["name"]+'</a><p><a href="'+events[i].ticket_url+'">Tickets</a></p></div>')
    }
}

function getConcertInfo(artist) {
  var artistCode = artist.split(' ').join('+');
  $.getJSON("http://api.bandsintown.com/events/search?artists[]="+artistCode+"&location=use_geoip&radius=20&format=json&callback=?&app_id=YOUR_APP_ID", function(response){
  var events = [];
  for (i = 0; i < response.length; i ++){
    events.push(response[i])
  }
  console.log(events);
  appendConcertInfo(events)
  })
}

function getArtistBio(artist) {
  var artistBioCode = artist.split(' ').join('+');
  console.log(artistBioCode);
  $.getJSON("http://developer.echonest.com/api/v4/artist/biographies?api_key=6N51VGIQONFDX0AGP&name="+artistBioCode+"&format=json&results=1&start=0&license=cc-by-sa", function(response){
  var artistBio = response.response.biographies[0]["text"];
  console.log(artistBio);
  appendArtistBio(artistBio);
  })
}

function appendArtistBio(artistBio){
      $("body").append('<div class="biography"><h1>Biography</h1><p>'+artistBio.substr(0, 200)+'...</p></div>')
    }


//event handler for right side button click; should display API information based on artist name input
$("#makeArtistInfo").on("click", function(){
  //need a way to remove previous artist info, but need to use a div that doesn't contain the input box and button
  console.log("click is working");
  $(".artistInfo").children().remove();
  var artist = $(".getArtistInfo").val();
  getConcertInfo(artist);
  getArtistBio(artist);
});
