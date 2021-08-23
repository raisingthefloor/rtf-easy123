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
<!--This Component displays a form to compose email message with Send and throw Away options-->
<template>
    <div>
        <div id="composeEmailFacade" r="unread" t="none" in="c" style="display: block; position: absolute; left: 751.032px; top: -130.952px; z-index: 99;" class="ui-draggable">

		<div class="compose_envcontents" style="width: 555px;">
			<div id="letter" style="top:132px;left:25px;position:absolute;">
				
				<div class="addressField">
                    <span id="toInLetterFacade">To </span>&nbsp;<span id="composeEmailTo">{{$store.state.mailTo.name}}</span>
				</div>
				<textarea id="inputpaperFacade" v-model="mail.text" scroll="no"></textarea>

				<div id="message" style="position: absolute;width: 460px; top: 580px; left: 25px;">
					<button class="send wahighlight" :class="[sendDisabled ? 'disabled-btn': '']" :disabled="sendDisabled" id="sendFacade" @click="sendMail" style=" top:580px; left:25px;">
						Send
					</button>
					<button class="throwaway wahighlight" id="throwawayFacade" @click="sendMailDiscard" style="position:absolute; position: absolute; right:20px; ">
						Throw Away
					</button>
				</div>
			</div>
		</div>
	</div>

    <div class='polaroid' r='unread' t='none' in='c' style="position:absolute">
        <img src='mail/mailinbox.png' id='compose_mailinbox' style='display:none;position:absolute;top:80px'>
        <div class='compose_envcontents' style='display:none; width:355px'>
            <img src='mail/envelope.png'   id='compose_envelope' style='position:absolute;'/>
            <img src='mail/fullback2_1.png'  id='flap_open' style='position:absolute; display:none; top:11px;' />
            <div id='letter' style='display:none; top:132px;left:25px; position:absolute; '>
                <img id='paper' src='mail/paper2.png' />
                <div id='message' style='position:absolute; width:300px; padding: 35px;  font:Times New Roman; font-size:18px; '>
                </div>
            </div>
            <img src='mail/back2_2.png'   id='envolope_back' style='position:absolute; top: 128px; display:none;'/>
            <img src='mail/uflap.png'  id='flap_close' style='position:absolute; top: 128px; display:none '/>
        </div>

        <div class='compose_frontcontents' style='display:none;'>
            <div style='position:absolute; left: 12px; top: 5px; font:Times New Roman; font-size:20px'> From</div>
            <div id="from" style='position:absolute; left: 12px; top: 29px; font:Times New Roman; font-size:20px;width:191px'>{{ mail.from }}</div>
            <div style='position:absolute; left: 120px; top: 104px; font:Times New Roman; font-size:20px' class="mail-to"> To</div>
            <div style='position:absolute; left: 120px; top: 128px; font:Times New Roman; font-size:20px'> {{ mail.to }}</div>
            <div style='position:absolute; width:300px; left: 10px; top: 204px; font:Times New Roman; font-size:18px; color:#333333' class="mail-subject">About:
                {{ mail.subject}}
            </div>
        
            <div style='position:absolute; left: 214px; top: 74px; font:Times New Roman; font-size:13px; color:66665c'>
                {{ mail.date }}
            </div>

            <div style='position:absolute; left: 281px; top: 5px;'> <img src='mail/sframe1.png' /></div>
            <div style='position:absolute; left: 288px; top: 11px;' ><img src='profile/Becky.jpg'  width='48' height='56'/></div>
            <div style='position:absolute; left: 285px; top: 15px;' ><img src='mail/seal2_1.png'/></div>
            <div style='position:absolute; left: 195px; top: 40px;' ><img src='mail/seal3_2.png'/></div>

        </div>
    </div>
    </div>
</template>
<script type="text/javascript" src="jquery/jquery-ui.min.js"></script>
<script type="text/javascript" src="mail/jquery-css-transform.js"></script>
<script type="text/javascript" src="mail/rotate3Di.js"></script>
<script>

import axios from 'axios';
import * as moment from 'moment';
export default {
    name: 'MailLetterPrompt',
    /**Reactive data */
    data(){
        return{
            mail:{
                to: this.$store.state.mailTo.email,
                text: '',
                html: '',
                from: this.$store.state.AppActiveUser.email,
                subject: 'Test Subject!',
                date: moment().format('MM.DD.YYYY')
            }
        }
    },
    /**Life Cycle hooks */
    mounted(){},

    /**Computed Properties */
    computed:{
        sendDisabled(){
            if(this.mail.subject && (this.mail.text || this.mail.html)){
                return false;
            }
            return true;
        }
    },

    /**methods */
    methods:{
        sendMail(){
            /**Using jquery to hide the composer form and using animation to denote send action */
            this.showPolaroid();
            
            //invoking send API with mail object
            this.mail.to = this.$store.state.mailTo.email; 
            if(this.mail.to && this.mail.subject && (this.mail.text || this.mail.html) 
                && this.mail.from)
            {
                axios.post(process.env.VUE_APP_API_HOST_NAME+'/api/message/send', this.mail)
                    .then(response => {
                        if(!response.data.error){
                            console.log(response);
                        }
                    })
                    .catch(err => console.log(err))
            }
        },

        sendMailDiscard(){
            this.$emit('sendMailDiscard');
        },

        truckAnimation(){
            const self = this;
            //Jquery code block for truck icon animation
            $("<img id='truck' src='mail/truck.png' style='z-index:100; position: absolute'></img>").appendTo("#containment-wrapper");
            //bring the envolope closer to the truck
            $("#truck").animate({'left':'400px'},800, () => {
                $("#composeEmailFacade + .polaroid").animate({'left':'600px', 'top':'-50px'}, 800, function(){
                    //hide envolope contents and show envolope icon only
                    $("#composeEmailFacade + .polaroid").find(".compose_envcontents").hide();
                    $("#composeEmailFacade + .polaroid").find(".compose_frontcontents").hide();
                    $("#compose_mailinbox").show();
                    //drop envelope icon inside truck
                    $("#compose_mailinbox").animate({'top': '80px', 'left': '-180px'}, 1000, () => {
                        //move the truck to the end of viewport
                        $("#compose_mailinbox").hide();
                        $("#truck").animate({'left': $(window).width()},1000, function(){
                            $(this).remove();

                            //send mail animation completed, reset showMailPrompt and showMailLetter
                            self.$parent.showMailLetter = false;
                        });
                    });
                })
                
            });
            
            return;
        },

        showPolaroid(){
            const self = this;
            let composeFacade = $("#composeEmailFacade");
            let cl = composeFacade.css('left');
            let ct = composeFacade.css('top');
            //add 100px to top for .polaroid element
            ct = +ct.substr(0, ct.length-2);
            composeFacade.hide();
            
            //animate big paper
            $("#paper_big").show();
            $("#paper_big").animate({'top': "-"+$("#paper_big").css('height')}, 500, function(){
                //hide and reset css for big paper
                $(this).css({'top':'0px'}).hide();
                
                $("#composeEmailFacade + .polaroid").animate({'left': cl, 'top':(ct+ 150 + "px")}, 0, function(){
                    $(this).css('z-index', 99)
                    $("#compose_envelope").css('top', '128px');
                    $("#composeEmailFacade + .polaroid").draggable({containment: "#drag-wrapper", scroll: false});
                    $("#composeEmailFacade + .polaroid").find(".compose_envcontents").show();
                    $("#composeEmailFacade + .polaroid").find("#envolope_back").show();
                    $("#composeEmailFacade + .polaroid").find("#flap_open").show();
                
                    //show letter element, hide message element and show small paper element
                    $(this).find("#letter").show();
                    $(this).find("#paper").css({'position': 'absolute', 'top':'-300px'});
                    $(this).find("#paper").animate({'top': '0px'}, 1000, function(){
                        $(this).css('position', 'unset');
                        //hide open flap and show close flap
                        $("#composeEmailFacade + .polaroid").find("#flap_open").hide();
                        $("#composeEmailFacade + .polaroid").find("#flap_close").show();

                        //rotate the envelope
                        $("#composeEmailFacade + .polaroid").find(".compose_envcontents").rotate3Di('-180',300,{
                            sideChange: function(){
                                //hide letter and backside of the envelope
                                $(this).find("#letter").hide();
                                $(this).find("#flap_open").hide();
                                $(this).find("#flap_close").hide();
                                $(this).find("#envolope_back").hide();
                            },
                            complete:function(){
                                //show front contents of the envelope
                                $("#composeEmailFacade + .polaroid").find(".compose_frontcontents").css({'display': 'block', 'position':'absolute', 'top':'128px'});
                                //start truck animation
                                self.truckAnimation();
                            }
                        });
                    });
                });
            });

            return;
        }
    }
}
</script>

<style>
    #inputpaperFacade{
        font-size: 20px;
        font-weight: bold;
        padding: 75px 35px 55px;
        overflow: none;
        resize: none;
        border: 0;
        width: 415px;
        height: 515px;
        background: url('/mail/inputpaper.png') no-repeat left top;
    }
    .addressField {
        border-bottom: 1px dashed #81BEF7;
        font-weight: bold;
        font-size: 18px;
    }
    #composeEmailFacade * .addressField {
        position: absolute;
        left: 10px;
        top: 0px;
        position: absolute;
        width: 400px;
        padding: 35px 35px 0px 35px;
    }
</style>