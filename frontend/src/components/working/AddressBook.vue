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
    <div>
        <div id="contact-list" v-show="!contactDetails">
            <div v-show="searchAlphabets.length">
                <div class="close" title="Reset Filter" @click="resetSearch">X</div><br/>
            </div>
            <table id="newspaper-b">
                <tbody v-show="filteredContacts.length">
                    <tr v-for="contact in filteredContacts" :id="contact.id" class="contact" 
                        :key="contact.id" style="height:95px;cursor:pointer" @click="showContactDetails(contact.id)">
                        <td style="padding-right:0px; margin:0px; width: 100px">
                            <!-- <img v-if="contact.avatarPath" id="contact_pic" :src="contact.avatarPath" width="70" height="70" />
                            <img v-else id="contact_pic" src="/images/user.jpg" width="70" height="70" /> -->
                            <address-book-contact-image 
                                v-show="contact.avatarName" :image="contact"
                                height="70" width="70"
                                @privateImageLoaded="storeImage"
                            >
                            </address-book-contact-image>
                            <img v-if="!contact.avatarName" src="@/assets/images/contact-profile-pic.png" alt="User Avatar" height="70" width="70">
                        </td>
                        <td id="contact_name" align="left" style="padding:0px; margin: 0px;" >
                            <span v-if="contact.contactName">{{contact.contactName}}</span>
                        </td>
                    </tr>
                </tbody>

                <tbody v-if="!filteredContacts.length">
                    <tr>
                        <td>No Contacts Found</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div id="contact-details" style="position:relative" v-if="contactDetails">
            <div class="close" title="Close Contact" @click="hideContactDetails">X</div>
            <div style= "position:relative;left:60px;width:120px; height:143px;border : 1px solid #f0e9eb; z-index: 3; background-color: #fefefe;">
                <div>
                    <!-- <img id="person_pic" src="/images/user.jpg" width="128" height="128" style="margin:30px;" /> -->
                    <div id="person_pic" style="margin:30px">
                        <address-book-contact-image 
                            v-show="contactDetails.avatarName" :image="contactDetails" height="128" width="128"
                        >
                        </address-book-contact-image>
                        <img v-if="!contactDetails.avatarName" src="@/assets/images/contact-profile-pic.png" alt="User Avatar" height="128" width="128">
                    </div>
                    <div id="person_name" align="left" style="padding-left:0px;position:absolute; left:188px; top:80px; font-size: 30px">{{contactDetails.contactName ? contactDetails.contactName : ''}}</div>
                    <div id="options">
                        <!--User Email Info-->
                        <div v-if="contactDetails.email && contactDetails.email.length">
                            <a v-for="email in contactDetails.email" :key="email" class="large awesome reply" :href="`mailto:${email}`">
                                <img align="left" style="padding:0px" src="/images/mail2.png"  />
                                <div id="email" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    {{email}}
                                </div>
                            </a>
                        </div>
                        
                        <!--User Contact Info-->
                        <div v-if="contactDetails.phoneNumber && contactDetails.phoneNumber.length">
                            <a v-for="contact in contactDetails.phoneNumber" :key="contact._id" 
                                class="large awesome" :href="`tel:${contact.number}`">
                                <img align="left" style="padding:0px" src="/images/phone1.png"  />
                                <div id="call" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    {{contact.number}}
                                </div>
                            </a>
                        </div>

                        <!-- Skype Link -->
                        <div v-if="contactDetails.skypeId">
                            <a class="large awesome" :href="`skype:${contactDetails.skypeId}`">
                                <img align="left" style="padding:0px" src="/images/skype.png" width="70" height="70" />
                                <div id="photo" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    Connect with Skype
                                </div>
                            </a>
                        </div>

                        <!-- Zoom Link -->
                        <div v-if="contactDetails.zoomMeetingURL">
                            <a class="large awesome" :href="contactDetails.zoomMeetingURL" target="_blank" rel="no-referrer">
                                <img align="left" style="padding:0px" src="/images/zoom.png" width="70" height="70" />
                                <div id="photo" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    Connect with Zoom
                                </div>
                            </a>
                        </div>

                        <!--User Photos -->
<!--                        <div>
                            <a class="large awesome" href="javascript:void(0)">
                                <img align="left" style="padding:0px" src="/images/stack3.png" width="70" height="70" />
                                <div id="photo" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    View <span v-if="contactDetails.contactName">{{contactDetails.contactName.split(' ')[0]}}</span>'s Photos
                                </div>
                            </a>
                        </div>-->

                        <!--Chat Button-->
                        <!-- <div>
                            <a class="large awesome" href="javascript:void(0)">
                                <img align="left" style="padding:0px" src="/images/Chat.png"  />
                                <div  id="chat" align="left" style="padding-left:80px; padding-top: 17px; font-size: 26px">
                                    Chat with <span v-if="contactDetails.contactName">{{contactDetails.contactName.split(' ')[0]}}</span>
                                </div>
                            </a>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import AddressBookContactImage from "../assistant/user/components/AddressBookContactImage";
export default {
    name: 'AddressBook',
    components:{
        AddressBookContactImage
    },
    data(){
        return{
            contacts: [],
            contactDetails: null
        }
    },

    props:{
        searchAlphabets:{
            type: Array,
            required: false,
            default: new Array()
        }
    },

    //Computed Properties
    computed:{
        filteredContacts(){
            if(this.searchAlphabets.length){
                return this.contacts.filter(contact => {
                    return (contact.contactName.toLowerCase().startsWith(this.searchAlphabets[0].toLowerCase()) 
                        || contact.contactName.toLowerCase().startsWith(this.searchAlphabets[1].toLowerCase()));
                });
            }
            return this.contacts;
        }
    },

    //Lifcycle hooks
    created(){
        this.getAllContacts();
    },
    
    methods:{
        getAllContacts(){
            axios.post(process.env.VUE_APP_API_HOST_NAME+"/api/assistant/user/get-all-contacts", {
                id: this.$route.params.id
            })
            .then(res => {
                if(res.status == 200 && res.data.status){
                    this.contacts = res.data.data;
                }
            })
            .catch(e => console.log(e));
        },

        showContactDetails(contactId){
            this.contactDetails = this.contacts.find(contact => contact.id === contactId);
        },

        hideContactDetails(){
            //this.contactDetails = null;
            //window.$("#contact-details").css('z-index', 1);
            window.$("#contact-details").animate({left: '500px'}, 500, () => {
              this.contactDetails = null;  
            });
        },

        resetSearch(){
            this.$emit('resetSearch');
        },

        storeImage(payload){
            const {id, imageData} = payload;
            let targetIdx = this.contacts.findIndex(contact => contact.id == id);
            if(targetIdx !== -1){
                this.$set(this.contacts, targetIdx, Object.assign({}, this.contacts[targetIdx], {imageData}));
            }
        }
    }
}
</script>
<style scoped src="../../assets/css/newcss.css"></style>
<style scoped src="../../assets/css/demo14-styles.css"></style>
<style scoped src="../../assets/css/contacts.css"></style>
<style scoped src="../../assets/css/style.css"></style>
<style scoped src="../../assets/css/contact_buttons.css"></style>
<style scoped src="@/assets/bootstrap-5/css/bootstrap.css"></style>

<style scoped>
.close{
    font-size: 1.2rem;
    position: absolute;
    right: 30px;
    top: 30px;
    font-weight: 800;
    cursor: pointer;
}
.awesome, .awesome:visited{
    width: 450px
}
</style>