var PlaylistView = function(playlist){
  this.playlist = playlist;
  this.$el = $("<div class='column column-6 playlist'><div class='playlist module'</div></div>");
};


var counter=0;
PlaylistView.prototype = {
  render: function(){
    var self = this;
    self.$el.html(self.playlistTemplate(self.playlist));
    $(".currentArtist").append(self.$el);
    var editButton = self.$el.find(".editPlaylist");
    editButton.on("click", function() {
      self.renderEditForm();
    });

  },
  renderEditForm: function() {
    var self = this;
    self.$el.html(this.playlistEditTemplate(this.playlist));

    self.$el.find(".updatePlaylist").on("click", function() {
      self.updatePlaylist();
    });

    self.$el.find(".deletePlaylist").on("click", function() {
      var data = {  id: self.playlist.id }
      self.playlist.destroy(data).then(function() { self.$el.fadeOut()});
    });
  },
  updatePlaylist: function() {
    var self = this;
    // console.log(this.playlist.id);
    var data = {  title: $('input[name=title]').val() }
    this.playlist.update(data)
    .then(function(){
        self.render()
    });
  },
  playlistEditTemplate: function(playlist) {
    var html = $("<div>");
    html.append("<input name='title' value='" + playlist.title + "'>");
    html.append("<input type='button' class='updatePlaylist' value='Update Playlist'></input>");
    html.append("<input type='button' class='deletePlaylist' value='Delete Playlist'></input>");
    return(html);
  },
  playlistTemplate: function(artist){
    var html = $("<h3 class='"+counter+" title'>" + this.playlist.title + "</h3>");
    html.append("<input type='button' class='editPlaylist' value='Edit Playlist'></input>");
    counter++
    var playlistName = this.playlist.title
    var artist = this.playlist.artist.split(", ");
    var artistCode = "";
    for (j = 0; j < artist.length; j++) {
        artistCode += "&artist="+artist[j].split(' ').join('+')
    };
    var songCount = this.playlist.songCount;
    $.getJSON("https://developer.echonest.com/api/v4/playlist/basic?api_key=6N51VGIQONFDX0AGP"+artistCode+"&format=json&results="+songCount+"&bucket=tracks&bucket=id:spotify", function(response){
        var tracks = [];
        for(i = 0;i < response.response.songs.length; i++){
            if (response.response.songs[i]["tracks"][0] === undefined) {
              continue;
            }
            else {
              var track = response.response.songs[i]["tracks"][0]["foreign_id"]
              var newString = track.substr(14);
              tracks.push(newString);
            }
        }
        var ids = tracks.join();
        html.append('<iframe id="musicframe" src="https://embed.spotify.com/?uri=spotify:trackset:'+playlistName+':'+ids+'" frameborder="0" height="500" width="400" allowtransparency="true"></iframe>')
          return(html);
      })
      return(html)
    }

}
