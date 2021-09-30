/**
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
 **/

exports.uniqid = async function (prefix = "", random = false) {
    return new Promise((resolve, reject) => {
        const sec = Date.now() * 1000 + Math.random() * 1000;
        const id = sec.toString(16).replace(/\./g, "").padEnd(14, "0");
        let unique =`${prefix}${id}${random ? `.${Math.trunc(Math.random() * 100000000)}`:""}`;
        resolve(unique)
    })
};

exports.deleteS3Object = async function (path, name) {
    return new Promise(async(resolve, reject) => {
        const aws = require("aws-sdk")
        aws.config.update({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
        })
        const s3 = new aws.S3()

        let deleted_data = await s3.deleteObject({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: path
        }).promise()

        resolve(deleted_data)
    })
}