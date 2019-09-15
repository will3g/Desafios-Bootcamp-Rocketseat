import Mail from '../../lib/Mail';

class SubscriptionMail {
  get key() {
    return 'SubscriptionMail';
  }

  async handle({ data }) {

    const { Event, User } = data;

    await Mail.sendMail({
      to: `${Event.User.nome} <${Event.User.email}>`,
      subject: `[${Event.titulo}] Nova inscrição`,
      template: 'subscription',
      context: {
        organizer: Event.User.nome,
        Event: Event.titulo,
        User: User.nome,
        email: User.email,
      },
    });
  }
}

export default new SubscriptionMail();