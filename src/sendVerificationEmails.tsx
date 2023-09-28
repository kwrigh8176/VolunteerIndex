import db_config from "./globals";

const nodemailer = require('nodemailer');

const sql = require('mssql');

export async function resendCodes(){

    var toEmail = sessionStorage.getItem("email")

    var randomToken = Math.floor(100000 + Math.random() * 900000)

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EmailUsername,
            pass: process.env.EmailPassword
        }
    });

    let mailDetails = {
        from: process.env.EmailUsername,
        to:  toEmail,
        subject: 'VolunteerIndex Verification Code',
        text: 'Enter this code into the VolunteerIndex application to verify your account: ' + randomToken
    };


    mailTransporter.sendMail(mailDetails, function(err: any, data: any) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

    var username = sessionStorage.getItem("username");
    var loginType = sessionStorage.getItem("loginType");

    await sql.connect(db_config)

    let request = new sql.Request()
    request.input("loginkey_parameter",randomToken)
    request.input("username",username)
    if (loginType == "Organization")
    {
        await request.query("UPDATE LoginKey SET LoginKey = @loginkey_parameter WHERE OrgId = @username")
    }
    else
    {
        await request.query("UPDATE LoginKey SET LoginKey = @loginkey_parameter WHERE VolunteerId = @username")
    }
    
}


export default async function sendVerificationMail(toEmail: string, loginType: string)
{
    sessionStorage.setItem("email",toEmail);

    var randomToken = Math.floor(100000 + Math.random() * 900000)

    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EmailUsername,
            pass: process.env.EmailPassword
        }
    });

    let mailDetails = {
        from: process.env.EmailUsername,
        to:  toEmail,
        subject: 'VolunteerIndex Verification Code',
        text: 'Enter this code into the VolunteerIndex application to verify your account: ' + randomToken
    };


    mailTransporter.sendMail(mailDetails, function(err: any, data: any) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });

    sessionStorage.setItem("loginType",loginType)

    var username = sessionStorage.getItem("username");

    await sql.connect(db_config)
    
    let request = new sql.Request()
    request.input("username_parameter",username)
    request.input("loginkey_parameter",randomToken)

    if (loginType == "Volunteer"){
        

        var result = await request.query("SELECT * FROM LoginKey WHERE VolunteerId = @username_parameter")

        request = new sql.Request()
        request.input("username_parameter",username)
        request.input("loginkey_parameter",randomToken)
        if (result.recordset.length == 1){
            await request.query("UPDATE LoginKey SET LoginKey = @loginkey_parameter WHERE VolunteerId = @username_parameter")
        }
        else{
            await request.query("INSERT INTO LoginKey (OrgId, VolunteerId, LoginKey) VALUES (NULL, @username_parameter, @loginkey_parameter)")
        }

       
                        
    }
    else
    {
        var result = await request.query("SELECT * FROM LoginKey WHERE OrgId = @username_parameter")

        request = new sql.Request()
        request.input("username_parameter",username)
        request.input("loginkey_parameter",randomToken)

        if (result.recordset.length == 1){
            await request.query("UPDATE LoginKey SET LoginKey = @loginkey_parameter WHERE OrgId = @username_parameter")
        }
        else{
            await request.query("INSERT INTO LoginKey (OrgId, VolunteerId, LoginKey) VALUES (@username_parameter, NULL, @loginkey_parameter)")
        }
        
    }

}

