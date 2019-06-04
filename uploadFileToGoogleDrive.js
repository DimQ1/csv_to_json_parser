/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];

const TOKEN_PATH = process.env.TOKEN_PATH || 'token.json';

function getAccessToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    return new Promise((resolve, reject) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) reject(new Error(`Error retrieving access token ${err}`));

                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) reject(err);
                    console.log('Token stored to', TOKEN_PATH);
                });
                resolve(oAuth2Client);
            });
        });
    });
}

function authorize(credentials) {
    const oAuth2Client = new google.auth.OAuth2(
        credentials.installed.client_id,
        credentials.installed.client_secret,
        credentials.installed.redirect_uris[0]
    );

    // Check if we have previously stored a token.
    return (new Promise((resolve, reject) => {
        fs.readFile(TOKEN_PATH, async (err, token) => {
            if (err) {
                await getAccessToken(oAuth2Client);
                resolve(oAuth2Client);
            } else {
                oAuth2Client.setCredentials(JSON.parse(token));
                resolve(oAuth2Client);
            }
        });
    }));
}

// upload File
function uploadFile(auth, pathUploadingFile) {
    const drive = google.drive({ version: 'v3', auth });
    const name = path.parse(pathUploadingFile).base;
    const fileMetadata = { name };
    const media = {
        mimeType: 'text/plain',
        body: fs.createReadStream(pathUploadingFile)
    };

    drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id'
    }, (err, file) => {
        if (err) {
            // Handle error
            console.error(err);
        } else {
            console.log('File Id: ', file.data.id);
        }
    });
}

module.exports = async (pathUploadingFile) => {
    const credentials = (new Promise((resolve, reject) => {
        fs.readFile('credentials.json', (err, content) => {
            if (err) {
                console.log(`Error loading client secret file ${err}`);
                reject(new Error(`Error loading client secret file ${err}`));
            }
            resolve(JSON.parse(content));
        });
    }));

    const oAuth2Client = await authorize(await credentials);

    uploadFile(oAuth2Client, pathUploadingFile);
};
