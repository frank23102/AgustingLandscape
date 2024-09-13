// Import the required modules
const express = require('express'); // Express is a web framework for Node.js
const nodemailer = require('nodemailer'); // Nodemailer is used to send emails from Node.js
const bodyParser = require('body-parser'); // Body-parser helps to parse incoming request bodies

// Initialize an Express application
const app = express();

// Define the port on which the server will run
// process.env.PORT is used for deployment (like on Heroku), otherwise, it will default to 3000
const port = process.env.PORT || 3000;

// Middleware to parse URL-encoded data (from forms)
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON data
app.use(bodyParser.json());

// Serve static files (like your HTML, CSS, images, etc.) from the "public" directory
app.use(express.static('public'));

// Define a POST route to handle form submissions
// When the form is submitted, the data is sent to the '/send' endpoint
app.post('/send', (req, res) => {
    // Destructure the incoming form data from the request body
    const { name, email, phone, message } = req.body;

    // Set up Nodemailer transport service with the email provider's configuration
    // You can use other services like Yahoo, Outlook, etc., by adjusting the 'service' option
    let transporter = nodemailer.createTransport({
        service: 'gmail', // The email service provider
        auth: {
            user: 'your-email@gmail.com', // Your email address (sender)
            pass: 'your-email-password'   // Your email password (for authentication)
            // Note: For better security, use environment variables to store credentials
        }
    });

    // Define the email options (like recipient, subject, and body)
    let mailOptions = {
        from: email, // The sender's email address (from the form)
        to: 'recipient-email@example.com', // The recipient's email address
        subject: `New Contact Form Submission from ${name}`, // Subject of the email
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage:\n${message}` // The email body content
    };

    // Send the email using the transporter object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // If there's an error while sending the email, log the error and send a response back to the client
            console.error(error);
            res.status(500).send('There was an error sending your message. Please try again later.');
        } else {
            // If the email is sent successfully, log the info and send a success message back to the client
            console.log('Email sent: ' + info.response);
            res.status(200).send('Thank you for contacting us, we will get back to you shortly.');
        }
    });
});

// Start the server and listen on the specified port
// The server will output a message to the console when it starts successfully
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
