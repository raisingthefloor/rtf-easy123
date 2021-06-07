<template>
  <div class="flap flap-second"> <img src="images/contact1.png"  />
    <div class="flap-child" style="">{{ this.letters }}</div>
  </div>
</template>

<script type="text/javascript" src="jquery/jquery-1.3.2.js"></script>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>

<script>
export default {
  name: 'Flap',
  props: ['letters', 't'],
  data() {
    return {
    }
  },
  mounted() {
    this.$el.style.top = this.t+"px"
  },
  methods: {

  }
}
</script>
