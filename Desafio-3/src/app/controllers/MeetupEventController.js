import * as Yup from 'yup';
import MeetupEvent from '../models/Event';

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

    const { 
      id, 
      titulo, 
      descricao, 
      localizacao, 
      data 
    } = await MeetupEvent.create(req.body);

    return res.json({
      id,
      titulo,
      descricao,
      localizacao,
      data,
    });
  }
}

export default new MeetupEventController();