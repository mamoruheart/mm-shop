const Mailgun = require("mailgun-js");

const keys = require("../config/keys");
const template = require("../config/template");

const { key, domain, sender } = keys.mailgun;

class MailgunService {
  init() {
    try {
      return new Mailgun({
        apiKey: key,
        domain
      });
    } catch (err) {
      console.error("Missing mailgun keys:", err?.message);
    }
  }
}

const mailgun = new MailgunService().init();

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      from: `Michael’s Machines <${sender}>`,
      to: email,
      subject: message.subject,
      text: message.text
    };

    return await mailgun.messages().send(config);
  } catch (err) {
    console.error("sendEmail:", err?.message);
    return err;
  }
};

const prepareTemplate = (type, host, data) => {
  try {
    let message = {};

    switch (type) {
      case "reset":
        message = template.resetEmail(host, data);
        break;
      case "reset-confirmation":
        message = template.confirmResetPasswordEmail();
        break;
      case "signup":
        message = template.signupEmail(data);
        break;
      case "merchant-signup":
        message = template.merchantSignup(host, data);
        break;
      case "merchant-welcome":
        message = template.merchantWelcome(data);
        break;
      case "newsletter-subscription":
        message = template.newsletterSubscriptionEmail();
        break;
      case "contact":
        message = template.contactEmail();
        break;
      case "merchant-application":
        message = template.merchantApplicationEmail();
        break;
      case "merchant-deactivate-account":
        message = template.merchantDeactivateAccount();
        break;
      case "order-confirmation":
        message = template.orderConfirmationEmail(data);
        break;
      default:
        console.log("prepareTemplate - no matching case:", type);
    }

    return message;
  } catch (err) {
    console.error("prepareTemplate:", err?.message);
    return {};
  }
};
