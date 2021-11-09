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
<!--This Component displays a form that requires Receipients user name or email address-->
<template>
    <div>
        <div id="addressBook" class="addressBook">
            <div id="page">
                <div>
                    <div id="Header" class="Header" v-html="$t('mail_to_prompt_component.touch_the_person')"></div>
                      <div id="EmailInstructions" style="" class="">
                        <span v-html="$t('mail_to_prompt_component.find_name_in_directory')"></span>
                        <br><br>
                        <button class="wahighlight"> {{ $t('mail_to_prompt_component.open_address_book') }}</button><br><br>
                        {{ $t('mail_to_prompt_component.or') }}<br><br>
                        {{ $t('mail_to_prompt_component.fill_in_name_email_address_here') }}<br><br>
                        <div style="padding-bottom:0px;">
                            {{ $t('mail_to_prompt_component.name') }} : <input type="text" v-model="mailUserName" id="name" style="font-size:22px;widht:100px;height:30px;" />
                        </div><br>
                        <div>
                          {{ $t('mail_to_prompt_component.email') }} : <input type="email" v-model="mailUserAddress" id="email" style="font-size:22px;widht:100px;height:30px;" />
                        </div><br><br>
                            <button class="wahighlight" :class="[writeMailBtnActive ? 'disabled-btn': '']" :disabled="writeMailBtnActive" @click="writeMailClicked">{{ $t('mail_to_prompt_component.write_email') }}</button>
                        </div>
                </div>
            </div>
        </div>  
    </div>  
</template>

<script>
export default {
    name: 'MailToPrompt',
    /**Reactive data */
    data(){
        return{

        }
    },
    /**Life Cycle hooks */
    mounted(){
        
    },

    /**methods */
    methods:{
        writeMailClicked(){
            this.$emit('writeMailClicked');
        }
    },

    /**Computed Properties */
    computed: {
        mailUserName: {
            get(){
                return this.$store.state.mailTo.name;
            },
            set(value){
                this.$store.commit('updateMailUserName', value);
            }
        },

        mailUserAddress: {
            get(){
                return this.$store.state.mailTo.email;
            },
            set(value){
                this.$store.commit('updateMailUserAddress', value);
            }
        },

        writeMailBtnActive(){
            //Activates Write mail button only if receipient's email address is given
            if(this.mailUserAddress && this.mailUserName){
                return !true;
            }
            return !false;
        }
    }
}
</script>

<style>
    .addressBook{
        z-index: 30; 
        top: 20px; 
        left: 350px; 
        height: 650px; 
        width: 550px; 
        opacity: 1; 
        display: block;
    }

    .Header{
        font-size: 25px; 
        text-align: left; 
        margin-top: 25px; 
        margin-left: 40px; 
        margin-bottom: 0px; 
        display: none;
    }

    #EmailInstructions{
        font-size: 25px; 
        text-align: center; 
        margin: 50px 50px 0px; 
        display: block;
    }
    .wahighlight{
        background-color: #FFA !important;
    }
</style>