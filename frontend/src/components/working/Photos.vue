<template>
  <div class="photos-main" style="background-color: #818182">
    <div id="albumContents" style="display: block;">

      <div id="noAlbumsMessage" style="text-align:center; padding:50px; display: none;">There are no albums</div>


      <div id="anAlbum" class="anAlbum" style="top: 0px; left: 0px; opacity: 1; width: 119.987px; display: block; height: 139.99px;">
        <div class="$showAlbum" style="text-decoration:none; cursor:pointer;">
          <img class="thumbnailStack" src="images/album/photoPile.png">
          <img class="$thumbnailURL albumThumbnail wahighlight" src="https://drive.google.com/uc?export=view&amp;id=0B4EBx0R_Zm3YYzJtY09HTFBaZUk">
          <div class="$name albumTitle">2008 Christmas</div>
        </div>
      </div>
      <div id="anAlbum" class="anAlbum" style="top: 0px; left: 140px; opacity: 1; width: 119.987px; display: block; height: 139.99px;">
        <div class="$showAlbum" style="text-decoration:none; cursor:pointer;">
          <img class="thumbnailStack" src="images/album/photoPile.png">
          <img class="$thumbnailURL albumThumbnail wahighlight" src="https://drive.google.com/uc?export=view&amp;id=0B4EBx0R_Zm3YYzJtY09HTFBaZUk">
          <div class="$name albumTitle">2008 Christmas</div>
        </div>
      </div>
<!--      <div class="anAlbum anAlbum_CLONED" style="top: 0px; left: 140px; opacity: 1; width: 119.987px; display: block; height: 139.99px;">
        <div class="$showAlbum" style="text-decoration:none; cursor:pointer;">
          <img class="thumbnailStack" src="images/album/photoPile.png">
          <img class="$thumbnailURL albumThumbnail" src="https://drive.google.com/uc?export=view&amp;id=0B4EBx0R_Zm3YNF9nbE9JV2xsdkE">
          <div class="$name albumTitle">Christmasses</div>
        </div>
      </div>-->

      <div id="albumGallery" style="display: none;"></div>
      <div id="galleryTitle" style="width: 171px; height: 167px;"></div>

    </div>
  </div>
</template>

<style>
#albumContents {
  position: absolute;
  left: 250px;
  right: 0px;
  top: 40px;
  bottom: 0px;
  font-size: 20px;
  text-shadow: -2px 2px 2px #ccc;
}
.anAlbum {
  position: absolute;
  width: 120px;
  height: 140px;
  text-align: center;
  padding: 15px 10px;
}
#albumContents {
  position: absolute;
  left: 250px;
  right: 0px;
  top: 40px;
  bottom: 0px;
  font-size: 20px;
  text-shadow: -2px 2px 2px #ccc;
}
img.thumbnailStack {
  position: absolute;
  width: 90%;
  top: 0px;
  left: 0px;
}
img.albumThumbnail {
  border: 4px solid white;
  -webkit-box-shadow: -2px 2px 3px 0px #ccc;
  -moz-box-shadow: -2px 2px 3px 0px #ccc;
  box-shadow: -2px 2px 3px 0px #ccc;
  width: 70%;
  position: absolute;
  top: 10px;
  left: 16px;
}
.wahighlight {
  background-color: #FFA !important;
}
.albumTitle {
  color: #666;
  position: absolute;
  bottom: 0px;
  height: 40px;
  text-align: center;
  width: 90%;
}
</style>

<script>
import axios from "axios";
export default {
  name: 'Photos',
  data() {
    return {
      folders: []
    }
  },
  mounted() {
    let self = this
    if(self.$store.state.home.folders && self.$store.state.home.folders.length)
    {
      axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/user/get-folders")
      .then((response) => {
        if(response.data.status)
        {
          self.$store.commit('STORE_HOME_FOLDERS', response.data.data)
          //self.$store.state.home.folders = response.data.data
        }
        else {
          console.log("response", response.data)
        }


      }, (error) => {
        console.log("error", error)
      })
    }

  },
}
</script>
