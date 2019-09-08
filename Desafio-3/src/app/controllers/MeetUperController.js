import * as Yup from 'yup';
import User from '../models/User';

class MeetUperController {
  async store(req, res) { //cria um novo usuário meetuper
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    
    if(userExists) {
      return res.status(400).json({ error: 'Usuário já existente' });
    }

    const { id, nome, email } = await User.create(req.body); //Cria de acrodo com o que é passdo pelo boyd
    return res.json({
      id,
      nome,
      email,
    }); //retorna o arquivo json
  } //Fim da criação de um novo usuário meetuper

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) =>
        oldPassword ? field.required() : field
      ),
      confirmPassword: Yup.string().when('password', (password, field) => 
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { email, oldPassword } = req.body;

    const userMeetup = await User.findByPk(req.userId);

    if (email !== userMeetup.email){

      const userMeetupExists = await User.findOne({ where: { email } });

      if (userMeetupExists) {
        return res.status(400).json({ error: 'Usuário inexistente' })
      }
    }

    if (oldPassword && !(await userMeetup.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha diferente' });
    }

    const { id, nome } = await userMeetup.update(req.body);

    return res.json({
      id,
      nome,
      email,
    });
  }
}

export default new MeetUperController();