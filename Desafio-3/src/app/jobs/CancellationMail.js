// import Mail from '../../lib/Mail';

// class CancellationMail {
//   get key() {
//     return 'CancellationMail';
//   }

//   async handle({ data }) {

//     const { Event, User } = data;

//     await Mail.sendMail({
//       to: `${Event.User.nome} <${Event.User.email}>`,
//       subject: `[${Event.titulo}] Inscrição cancelada :(`,
//       template: 'cancellation',
//       context: {
//         organizer: Event.User.nome,
//         Event: Event.titulo,
//         User: User.nome,
//         email: User.email,
//       },
//     });
//   }
// }

// export default new CancellationMail();