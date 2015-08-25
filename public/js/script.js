
$("#makePlaylist").on("click", function(){
    $(".currentArtist").children().remove()
    var artist = $("#artistInput").val()
    var artist = artist.split(", ")
    var artistCode = "";
    for (i = 0; i < artist.length; i++) {
      artistCode += "&artist="+artist[i].split(' ').join('+');
    }
    console.log(artistCode);
    var songCount = $("#songCount").val()
    $.getJSON("http://developer.echonest.com/api/v4/playlist/basic?api_key=6N51VGIQONFDX0AGP"+artistCode+"&format=json&results="+songCount+"&bucket=tracks&bucket=id:spotify", function(response){
        console.log(response);
        var tracks = [];
        for(i=0;i < response.response.songs.length; i++){
            var track = response.response.songs[i]["tracks"][0]["foreign_id"]
            var newString = track.substr(14);
            console.log(track);
            tracks.push(newString);
        }
        var ids = tracks.join();
        var playlistName = $("#listName").val();
        $(".currentArtist").append('<iframe id="musicframe" src="https://embed.spotify.com/?uri=spotify:trackset:'+playlistName+':'+ids+'" frameborder="0" height="800" width="400" allowtransparency="true"></iframe>')
    })
    var bandCode = "";
    for (i = 0; i < artist.length; i++) {
      bandCode += "&artists[]="+artist[i].split(' ').join('+');
    }
    bandCode = bandCode.substr(1);
    console.log(bandCode);
    $.getJSON("http://api.bandsintown.com/events/search?"+bandCode+"&location=use_geoip&radius=20&format=json&app_id=YOUR_APP_ID", function(response){
      console.log(response);
      console.log(response[0]);
      var events = [];
      for (i = 0; i < response.length; i ++)
        {events.push(response[i]["ticket_url"])}
      console.log(events)
  })
})

// $("div.artist-name.ellipsis").change(function(){
//     var artist = $(".currentArtist").html()
//     $.getJSON("http://api.bandsintown.com/events/recommended?artists[]="+artist+"&location=use_geoip&format=json&app_id=YOUR_APP_ID", function(response){
//         console.log(response);
//     })
//     $.getJSON("http://developer.echonest.com/api/v4/artist/news?api_key=6N51VGIQONFDX0AGP&name="+artist+"&format=json", function(response){
//         console.log(response);
//     })
// })
