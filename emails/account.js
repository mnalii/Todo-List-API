const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: `${email}`,
      from: "muh.nurali43@gmail.com",
      subject: "Thanks for joining in!",
      text: `Welcome to the app, ${name} . Let me know how you get along with the app.`
    })
    .catch(err => {
      console.log(err);
    });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "admin@xyz.com",
    subject: "Sorry to see you go!",
    text: `Goodbye, ${name}. I hope to see you back sometime soon.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
};
