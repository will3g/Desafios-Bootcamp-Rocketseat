import * as Yup from 'yup';
import { Op } from 'sequelize';
import { isBefore, parseISO, startOfDay, endOfDay } from 'date-fns';
import MeetupEvent from '../models/Event';
import UserMeetup from '../models/User';

class MeetupEventController {
  async index(req, res) {
    const where = {};
    const page = req.query.page || 1;

    if(req.query.date) {
      const searchDate = parseISO(req.query.date);

      where.date = {
        [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
      };
    }

    const meetups = await MeetupEvent.findAll({
      where,
      include: [UserMeetup],
      limit: 10,
      offset: 10 * page - 10,
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      banner_id: Yup.number().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      data: Yup.date().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validação falhou' });
    }

    if(isBefore(parseISO(req.body.data), new Date())) {
      return res.status(400).json({ error: 'Data inválida para realização do evento' });
    }

    const user_id = req.userId;

    const eventMeetup = await MeetupEvent.create({
      ...req.body,
      user_id,
    });

    return res.json(eventMeetup);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
        titulo: Yup.string().required(),
        banner_id: Yup.number().required(),
        descricao: Yup.string().required(),
        localizacao: Yup.string().required(),
        data: Yup.date().required(),
        password: Yup.string().min(6).required(),
        confirmPassword: Yup.string().when('password', (password, field) => 
          password ? field.required().oneOf([Yup.ref('password')]) : field
        ),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Opa, tem alguma coisa errada!' });
    }

    const user_id = req.userId;

    const userMeetuper = await UserMeetup.findByPk(req.userId); // Procure por id do usuário
    
    const eventMeetup = await MeetupEvent.findByPk(req.params.id); // Procura o id do evento ppassado na url

    if (eventMeetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Não autorizado' });
    }
    
    if(isBefore(parseISO(req.body.data), new Date())) {
      return res.status(400).json({ error: 'Data inválida para realização do evento' });
    }
    
    const { password } = req.body; // Seleciona o password da requisição

    if(password && !(await userMeetuper.checkPassword(password))) { // Compara com o código hash da senha
      return res.status(401).json({ error: 'Ops, senha incorreta' });
    }

    if(eventMeetup.past) {
      return res.status(400).json({ error: 'Não é possível fazer atualização' });
    }

    await eventMeetup.update(req.body);

    return res.json(eventMeetup);
  }

  async delete(req, res) {

    const user_id = req.userId;

    const meetup = await MeetupEvent.findByPk(req.params.id);

    if(meetup.user_id !== user_id) {
      return res.status(401).json({ error: 'Não autorizado' });
    }

    if (meetup.past) {
      return res.status(401).json({ error: "Não é possível cancelar o Meetup" });
    }

    await meetup.destroy();

    return res.send();
  }
}

export default new MeetupEventController();