# Easy123

All the APIs are developed in nodejs & frontend in vuejs

### Prerequisites

* Please open the following ports 
  ```
  1000 port for frontend
  1002 port for web server 
  ```
  
* if you want to setup the SSL we recommand to use this URL and follow for nginx 
  * https://tecadmin.net/how-to-setup-lets-encrypt-on-ubuntu-20-04/
  
* Install NodeJS 
  
  * https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04 (Option - 1)

### Domain Setup

- To configure any domain you have to setup the Nginx Reverse Proxy on your Ubuntu system, you can follow this artical for more detail 

  https://www.hostinger.in/tutorials/how-to-set-up-nginx-reverse-proxy/

  Make sure you set the port `1000` so that your configuared domain open the URL on that specific port 

### MailJet Setup
- To configure the mailjet you need to open the account on https://app.mailjet.com/signup (if not created)
- Once the account setup is completed you need to generate the API Keys(Public & Private)
- Follow this article https://javascript.plainenglish.io/how-to-send-emails-in-node-e5fb0a48d46d and check section of (In Mailjet & Additional Tips for domain verification process)


### Environment Variables 

 Following variables you need to change as per your requirements in ```docker-compose.yml```
  - ```VUE_APP_API_HOST_NAME``` //used to communicate with the backend 
  - ```FRONT_URL``` //used to communicate with frontend 
  - ```MJ_APIKEY_PUBLIC``` // Mailjet Public Key 
  - ```MJ_APIKEY_PRIVATE``` // Mailjet Private key
  - ```MJ_SENDER_EMAIL``` // Mailjet sender email
  - ```MJ_SENDER_NAME```  // Mailjet sender name

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/raisingthefloor/rtf-easy123.git
   ```

2. Switch to master branch
   ```sh
   git checkout main
   ```

3. Go inside the root directly and open ```frontend``` folder in terminal

   ````shell
   npm install
   ````

   Now go back to root folder 

4. Build docker image from source using the composer command
   ```sh
   docker-compose build --no-cache
   ```

 5. Run the docker image
    ```sh
     docker-compose up -d

****
Below are the all third party libraries in the project


**Backend**

[@googleapis/docs](https://www.npmjs.com/package/@googleapis/docs), [@sentry/node](https://www.npmjs.com/package/@sentry/node), [@sentry/tracing](https://www.npmjs.com/package/@sentry/tracing), [bcrypt](https://www.npmjs.com/package/bcrypt), [cors](https://www.npmjs.com/package/cors), [dotenv](https://www.npmjs.com/package/dotenv), [express](https://www.npmjs.com/package/express), [express-validator](https://www.npmjs.com/package/express-validator), [googleapis](https://www.npmjs.com/package/googleapis), [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), [mimemessage](https://www.npmjs.com/package/mimemessage), [mongodb](https://www.npmjs.com/package/mongodb), [mongoose](https://www.npmjs.com/package/mongoose), [node-mailjet](https://www.npmjs.com/package/node-mailjet), [pine](https://www.npmjs.com/package/pine)


**Frontend**

[@sentry/tracing](https://www.npmjs.com/package/@sentry/tracing), [@sentry/vue](https://www.npmjs.com/package/@sentry/vue), [axios](https://www.npmjs.com/package/axios), [bootstrap](https://www.npmjs.com/package/bootstrap), [core-js](https://www.npmjs.com/package/core-js), [cors](https://www.npmjs.com/package/cors), [jquery](https://www.npmjs.com/package/jquery), [moment](https://www.npmjs.com/package/moment), [sweetalert](https://www.npmjs.com/package/sweetalert), [vue](https://www.npmjs.com/package/vue), [vue-i18n](https://www.npmjs.com/package/vue-i18n), [vue-meta](https://www.npmjs.com/package/vue-meta), [vue-router](https://www.npmjs.com/package/vue-router), [vue-toasted](https://www.npmjs.com/package/vue-toasted), [vuex](https://www.npmjs.com/package/vuex)