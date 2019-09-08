import jwt from 'jsonwebtoken';

import * as Yup  from 'yup';
import User from '../models/User';
import configAut from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Validação falhou' });
    }

    const { email, password } = req.body;

    const userMeetup = await User.findOne({  where: { email } });

    if(!userMeetup) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if(!(await userMeetup.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, nome } = userMeetup;

    return res.json({
      userMeetup: {
        id,
        nome,
        email,
      },
      token: jwt.sign({ id }, configAut.secret, {
        expiresIn: configAut.expiresIn},
      ),
    });
  }
}

export default new SessionController();