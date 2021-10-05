<!--
Copyright 2020 Raising the Floor - International

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://github.com/GPII/universal/blob/master/LICENSE.txt

The R&D leading to these results received funding from the:
* Rehabilitation Services Administration, US Dept. of Education under
grant H421A150006 (APCP)
* National Institute on Disability, Independent Living, and
Rehabilitation Research (NIDILRR)
* Administration for Independent Living & Dept. of Education under grants
H133E080022 (RERC-IT) and H133E130028/90RE5003-01-00 (UIITA-RERC)
* European Union's Seventh Framework Programme (FP7/2007-2013) grant
agreement nos. 289016 (Cloud4all) and 610510 (Prosperity4All)
* William and Flora Hewlett Foundation
* Ontario Ministry of Research and Innovation
* Canadian Foundation for Innovation
* Adobe Foundation
* Consumer Electronics Association Foundation
-->
<template>
  <div class="photos-main" style="background-color: #818182">
    <div id="albumContents" style="display: block;">

      <div id="noAlbumsMessage" style="text-align:center; padding:50px; display: none;">There are no albums</div>


      <div class="anAlbum" style="top: 284.961px; left: -150px; opacity: 0; width: 119.987px; display: block; height: 139.99px;" v-for="(folder, index) in $store.state.home.folders" :key="index" v-bind:style="{ left: (index * 140) + 'px' }">
        <div class="$showAlbum" style="text-decoration:none; cursor:pointer;" @click="showAlbum(folder, index)" :id="'showAlbum_'+index">
          <img class="thumbnailStack" src="@/assets/images/photo-pile.png">

          <photos-image class="$thumbnailURL albumThumbnail wahighlight" :image="getThumbImage(folder)" :folder="folder.id"></photos-image>

          <div class="$name albumTitle">{{ folder.name }}</div>
        </div>
      </div>


      <div id="albumGallery" v-if="showAlbumStatus == 'SHOWING'">

<!--        <div class="galleryPicture" v-bind:class="{
          'prevSecondAlbumImage': (index == (current_photo_index-2) && current_photo_index > index),
          'prevFirstAlbumImage': (index == (current_photo_index-1) && current_photo_index > index),
          'firstAlbumImage': index == current_photo_index,
          'secondAlbumImage': (index == (current_photo_index+1) && current_photo_index < index),
          'thirdAlbumImage': (index == (current_photo_index+2) && current_photo_index < index),
          'fourthAlbumImage': (index != current_photo_index && index != (current_photo_index+1) && index != (current_photo_index+2) && current_photo_index < index),
          'prevThirdAlbumImage': (index != current_photo_index && index != (current_photo_index-1) && index != (current_photo_index-2) && current_photo_index > index)
        }" v-for="(photo, index) in current_album.photos" :key="'photo_'+index" @click="nextActiveIndex(index)">
          <photos-image :image="photo" style="opacity: 1;" :folder="current_album.id"></photos-image>

          <div class="pictureNumber">{{ (index + 1) }}</div>
        </div>-->

      </div>
      <div id="galleryTitle" style="width: 171px; height: 167px;" v-if="showAlbumStatus == 'SHOWING'">{{ current_album.name }}</div>
      <div id="closeGallery" style="position: absolute; width: 171px; height: 167px; left: 0px; top: 220px;" v-if="selectedAlbum">
        <button style="background-color: #E94600; border: 1px solid transparent; color: rgb(255, 255, 255); text-align: center; text-decoration: none; padding: 0.375rem 0.75rem; font-size: 1rem; border-radius: 0.25rem;" @click="hideAlbum">Close</button>
      </div>

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
#galleryTitle {
  font-size: 20px;
  text-shadow: -2px 2px 2px #ccc;
  color: #000000;
  font-weight: bold;
  position: absolute;
  top: 180px;
  left: 0px;
  text-align: left;
}
#albumGallery {
  position: absolute;
  left: 0px;
  right: 50px;
  top: 170px;
}
.galleryPicture {
  position: absolute;
  border: 8px solid white;
  background-color: white;
  -webkit-box-shadow: -2px 5px 10px #666;
  -moz-box-shadow: -2px 5px 10px #666;
  box-shadow: -2px 5px 10px #666;
  text-align: center;
  overflow: hidden;
}
.pictureNumber {
  position: absolute;
  right: 2px;
  bottom: 0px;
  color: black;
  text-shadow: -1px 1px 2px white;
  font-size: 18px;
}
.prevFirstAlbumImage {
  width: 480px;
  height: 359px;
  left: 51px;
  top: 77px;
  z-index: 2;
  display: block;
}
.prevSecondAlbumImage {
  width: 336px;
  height: 251px;
  left: 15px;
  top: 131px;
  z-index: 1;
  display: block;
}
.prevThirdAlbumImage {
  width: 336px;
  height: 251px;
  left: 15px;
  top: 131px;
  z-index: 0;
}
.firstAlbumImage {
  width: 686px;
  height: 514px;
  left: 172px;
  top: 0px;
  z-index: 3;
}
.secondAlbumImage {
  width: 480px;
  height: 359px;
  left: 499px;
  top: 77px;
  z-index: 2;
}
.thirdAlbumImage {
  width: 336px;
  height: 251px;
  left: 679px;
  top: 131px;
  z-index: 1;
}
.fourthAlbumImage {
  width: 336px;
  height: 251px;
  left: 679px;
  top: 131px;
  z-index: 0;
}
</style>

<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="js/gallery.js"></script>
<script>

import axios from "axios";
import PhotosImage from "./PhotosImage";
import Gallery from "../../assets/js/gallery";
import swal from "sweetalert";

export default {
  name: 'Photos',
  components: {
    "PhotosImage": PhotosImage
  },
  data() {
    return {
      folders: [],
      showAlbumStatus: "NOT_SHOWING",
      current_album: null,
      current_photo_index: 0,


      gallery: null,
      selectedAlbum: null,
      positionOfAlbum: null

    }
  },
  mounted() {
    let self = this
    let pos = $('.albumButton').position()
    var contentsWidth = $('#albumContents').width();
    var css = {
      top: pos.top + 50 + 'px',
      left: pos.left + 100 - $('#albumContents').position().left + 'px',
      opacity: 0
    };
    var albumNodes = $('.anAlbum').css(css);

    //animate albums to a grid
    var top = 0;
    var left = 0;
    var width = albumNodes.outerWidth();
    var height = albumNodes.outerHeight();

    if (albumNodes.length)
    {
      for(var i=0; i<albumNodes.length; i++) {
        $(albumNodes[i]).animate({top:top+'px', left:left+'px', opacity:1}, 500);
        left += width;
        if(left + width > contentsWidth) {
          left = 0;
          top += height;
        }
      }
    }
    else
    {
      $("#noAlbumsMessage").show()
    }


  },
  beforeDestroy() {

    if(this.hideAlbum()) {
      setTimeout(this.hideAlbums(), 500);
    }
  },
  methods: {
    getThumbImage(folder) {
      if(folder.photos && folder.photos.length)
      {
        return folder.photos[0]
        //axios.get(process.env.VUE_APP_API_HOST_NAME)
      }
    },
    /** show album images **/
    showAlbum(folder, index) {
      this.showAlbumStatus = "SHOWING"
      this.current_album = folder
      this.current_photo_index = 0

      let self = this

      this.$nextTick(function () {
        let urls = new Array();

        //check if urls already exists
        let stateFolder = self.$store.state.home.folders.find(obj => obj.id == folder.id)
        if(stateFolder.photosUrls)
        {
          self.showAlbumExtended(folder, index, stateFolder.photosUrls)
        }
        else
        {
          axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/user/folders/photos", {
            folder_id: folder.id
          })
              .then((response) => {
                if(response.data.status)
                {
                  urls = response.data.data
                  let payload = {
                    folder_id: folder.id,
                    urls: urls
                  }

                  //save to vuex store
                  self.$store.commit('STORE_HOME_FOLDER_PHOTOS_ARRAY', payload)

                  self.showAlbumExtended(folder, index, urls)

                }
                else
                {
                  swal(self.$t('server_error_occurred_please_contact_admin'), {
                    icon: "warning",
                  })
                }
              }, (error) => {
                console.log(error)
                swal(self.$t('server_error_occurred_please_contact_admin'), {
                  icon: "warning",
                })
              })
        }
      })

    },

    /** show album images extended **/
    showAlbumExtended(folder, index, urls)
    {
      let self = this

      self.hideAlbum(); //hide the open album (if exists)
      let albumWrapper = $("#showAlbum_"+index)
      var gallery = $('#albumGallery');
      self.gallery = new Gallery($, gallery, urls,350,1);
      var node = $(albumWrapper).parent();

      //remember the position of the album thumbnail
      self.selectedAlbum = node;
      self.positionOfAlbum = self.getSizeAndPosition(node);
      $('#galleryTitle').html(folder.name);

      //move thumbnail and show gallery
      node.animate({
        top: '170px',
        left: '130px',
        width:'580px',
        height: '460px'
      }, 500, 'linear', function() {
        $(this).hide();
      });
      gallery.fadeIn(200);
    },


    /** gets the size and position of a jQuery node, used for recalling a nodes position/size.*/
    getSizeAndPosition(node) {
      return {
        left: node.css('left'),
        top: node.css('top'),
        height: node.css('height'),
        width: node.css('width')
      };
    },


    /** activate next index **/
    nextActiveIndex(index)
    {
      this.current_photo_index = index
    },

    /** hides the currently-open (if exists) album. returns true if an album was open.*/
    hideAlbum() {
      if(this.selectedAlbum) {
        $('#galleryTitle').html('');
        var gallery = $('#albumGallery');
        gallery.hide();
        gallery.html(''); //clear the current gallery

        this.selectedAlbum
            .show()
            .animate(this.positionOfAlbum, 500);

        this.selectedAlbum = null;
        return true;
      }
      return false;
    }
  }
}
</script>
