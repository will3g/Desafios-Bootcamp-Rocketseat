import * as Yup from 'yup';
import MeetupEvent from '../models/Event';
import { isBefore, parseISO } from 'date-fns';

class MeetupEventController {
  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
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

    const meetup_id = req.userId;

    const eventMeetup = await MeetupEvent.create({
      ...req.body,
      meetup_id,
    });

    return res.json(eventMeetup);
  }
}

export default new MeetupEventController();