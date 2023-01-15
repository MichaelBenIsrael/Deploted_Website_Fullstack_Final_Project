const express = require('express')
const router = express.Router()
const { Treatment, User, Contact } = require('../models/treatment')
var nodemailer = require('nodemailer')


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'bestgarageinbraude@gmail.com',
        pass: 'mrsyjhsejdemtdcp'
    },
    secure: false
})



// Request to login 
router.post('/login', async (req, res) => {
    var user;
    var password;

    try {
        const all_users = await User.find();
        user = all_users.filter(x => x.email == req.body.email);
        password = user.filter(x => x.password == req.body.password);
        if (password.length == 0) {
            return res.status(400).json({ message: 'False' });
        }
        return res.json({ message: 'True' });

    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})


// Request for creating a new account 
router.post('/signup', async (req, res) => {
    var user;
    const new_user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const all_users = await User.find();
        user = all_users.filter(x => x.email == req.body.email);
        if (user.length == 0) {
            var mailOptions = {
                from: 'BestGarageInBraude@gmail.com',
                to: 'benisraelmichael@gmail.com',
                subject: 'Your account has been created successfully',
                text: 'Dear ' + req.body.email.split('@')[0] +
                    ',\n\nWe are so glad to have you on board!\n You are now one of the exclusive clients of the world famous BestGarage.' +
                    '\n\nThank you and drive safe,\n BestGarageInBraude'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            const newUser = await new_user.save();
            res.json({ message: 'True' });
        }
        else {
            res.json({ message: 'False' });
        }

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})



// request to begin Forget password process
router.post('/forgetpassword', async (req, res) => {
    var user;

    try {
        const all_users = await User.find();
        user = all_users.filter(x => x.email == req.body.email);
        if (user.length == 0) {
            return res.json({ message: 'False' });
        }

        var mailOptions = {
            from: 'BestGarageInBraude@gmail.com',
            to: 'benisraelmichael@gmail.com',
            subject: 'Recent changes to your BestGarage account',
            text: 'Dear ' + req.body.email.split('@')[0] + ',\n\nAs requested your password is: ' + user[0].password + '\n\nThank you and drive safe,\n BestGarageInBraude'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        return res.json({ message: 'True' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})


// request for new cotact us summision
router.post('/contact-us', async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const concern = req.body.concern;
        const subject = req.body.subject;

        // send mail to user
        var mailOptions = {
            from: 'BestGarageInBraude@gmail.com',
            to: email,
            subject: 'BestGarage - Contact us conformation',
            text: 'Dear ' + name + ',\n\nThank you for contacting us.\nWe have received your approch regarding: ' + concern +
                '.\nWith the following message:\n' + subject +
                '\n\nWe will do our absolute best to get back to you within the next 24 hours.\n\nThank you and drive safe,\n BestGarageInBraude'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        const contact = new Contact({
            name: req.body.name,
            email: req.body.email,
            concern: req.body.concern,
            subject: req.body.subject
        })
        await contact.save();
        res.status(200).json({ message: 'True' });

    } catch (err) {
        res.status(500).json({ message: err.mesage });
    }
})


// request to get all user treatments
router.get('/dashboard/:mail', async (req, res) => {
    var user_treatments;

    try {
        const treatments = await Treatment.find();
        user_treatments = treatments.filter(x => x.workerEmail == req.params.mail);
        res.json(user_treatments);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
})



// request to Create a new treatment
router.post('/dashboard/createTreatment', async (req, res) => {
    var user;
    var input_mail = req.body.workerEmail;

    const users = await User.find();

    // validate the given e-mail is a signed user
    user = users.filter(x => x.email == input_mail)
    if (user.length == 0) {
        return res.status(400).json({ message: 'Unable to find user' })
    }

    // valiate the given car number
    if (req.body.carNumber.length != 8 || isNaN(req.body.carNumber)) {
        return res.status(400).json({ message: 'Car number is not valid' })
    }

    const treatments = await Treatment.find();

    let maxTreatmentNumber = "0";

    treatments.forEach((treatment) => {
        if (parseInt(treatment.treatmentNumber, 10) > parseInt(maxTreatmentNumber, 10)) {
            maxTreatmentNumber = treatment.treatmentNumber;
        }
    })

    const treatment = new Treatment({
        treatmentNumber: `${(parseInt(maxTreatmentNumber, 10) + 1)}`,           // environmental variable to serve as an auto increment
        treatmentInformation: req.body.treatmentInformation,
        workerEmail: req.body.workerEmail,
        carNumber: req.body.carNumber
    })


    try {
        const newTreatment = await treatment.save();
        process.env.treatmentNum = parseInt(70) + 1;
        res.status(201).json(newTreatment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})



// request to update a treatment 
router.patch('/dashboard/updates', async (req, res) => {
    if (req.body.treatmentNumber == null) {
        return res.status(400).json({ message: 'False' })
    }

    try {
        const treatment = await Treatment.find({ treatmentNumber: req.body.treatmentNumber })
        if (treatment.length == 0) {
            return res.status(400).json({ message: 'False' })
        }
        // validate the given car number
        if (req.body.carNumber.length != 8 || isNaN(req.body.carNumber)) {
            return res.status(400).json({ message: 'Car number is not valid' });
        }

        var myquery = { treatmentNumber: req.body.treatmentNumber };
        var newvalues = { $set: { treatmentInformation: req.body.treatmentInformation, carNumber: req.body.carNumber, date: Date.now() } };
        const options = { upsert: true };

        await Treatment.updateOne(myquery, newvalues, options);
        res.status(200).json(treatment);
    } catch (err) {
        res.status(500).json({ message: err.message });

    }
})


// request to delete a treatment
router.delete('/dashboard/delete/:id', async (req, res) => {
    try {
        const validation = await Treatment.find({ treatmentNumber: req.params.id });
        if (validation.length == 0) {
            return res.json({ message: 'False' })
        }
        const treatment = await Treatment.remove({ treatmentNumber: req.params.id });
        return res.json({ message: 'True' });
    } catch (err) {
        res.status(500).json({ message: err.mesage }
        )
    }
});

module.exports = router;